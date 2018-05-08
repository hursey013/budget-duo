import './stylesheets/styles.scss'

import { buildChart, firebaseApp, formatter, ui, uiConfig, usersRef } from './config'
import debounce from 'debounce';
import Inputmask from 'inputmask';
import sample from './sample';

const accountCreate = document.querySelector('.account-create');
const accountLogin = document.querySelector('.account-login');
const accountSignout = document.querySelector('.account-signout');
const breakdownTotal = document.querySelector('.breakdown-total');
const chartContainer = document.getElementById('chart');
const expenseContainer = document.querySelector('.expenses');
const incomeContainer = document.querySelector('.incomes');
const loader = document.querySelector('.loader');
const loginContainer = document.querySelector('.login-container');
const rowContainer = document.querySelector('.rows');

// Initialize
let currentUid = null;

firebaseApp.auth().onAuthStateChanged(function(user) {
  if (ui.isPendingRedirect()) {
    auth(true);
  } else if (user && user.uid != currentUid) {
    signIn(user);
  } else {
    signInAnonymously();
  }
});

function auth(pendingRedirect) {
  loginContainer.classList.remove('hidden');
  ui.start('#firebaseui-auth-container', uiConfig);
  if (pendingRedirect) loader.classList.remove('hidden');
}

function signIn (user) {
  currentUid = user.uid;

  loginContainer.classList.add('hidden');
  toggleAccountLinks();

  usersRef.child(currentUid).once('value').then(function(snapshot) {
    const object = snapshot.val();

    object ? buildUI(object) : buildUI(retrieveLocalObject());
  });
}

function retrieveLocalObject () {
  const object = JSON.parse(localStorage.getItem('budget'));

  localStorage.removeItem('budget');
  return usersRef.child(currentUid).set(object)
}

function signInAnonymously () {
  currentUid = null;

  const arrayToObject = (array) =>
     array.reduce((obj, item) => {
       obj[usersRef.push().key] = item
       return obj
     }, {})
  const object = {};

  object.incomes = arrayToObject(sample.incomes);
  object.expenses = arrayToObject(sample.expenses);

  localStorage.setItem('budget', JSON.stringify(object));
  buildUI(object);
}

// Functions
function buildUI (budget) {
  const expenses = budget.expenses;
  const incomes = budget.incomes;

  window.chart = buildChart(chartContainer);

  if (incomes) {
    Object.keys(incomes).forEach(incomeKey => {
      addIncome(incomes[incomeKey], incomeKey);
    });
  }

  if (expenses) {
    Object.keys(expenses).forEach(expenseKey => {
      addExpense(expenses[expenseKey], expenseKey);
    });
  }
}

function updateJson (value, name, type, key) {
  if (currentUid) {
    const object = {};

    object[name] = value;
    usersRef.child(currentUid).child(type).child(key).update(object);
  } else {
    const object = JSON.parse(localStorage.getItem('budget'));

    object[type][key] = object[type][key] || {};
    object[type][key][name] = value;
    localStorage.setItem('budget', JSON.stringify(object));
  }
}

function deleteJson (type, key) {
  if (currentUid) {
    usersRef.child(currentUid).child(type).child(key).remove();
  } else {
    const object = JSON.parse(localStorage.getItem('budget'));

    delete object[type][key];
    localStorage.setItem('budget', JSON.stringify(object));
  }
}

function addExpense (expense, expenseKey) {
  const template = require('./templates/expenses.handlebars');
  const div = document.createElement('div');
  const key = expenseKey || usersRef.push().key;

  div.id = key;
  div.classList.add('expense');
	div.innerHTML = template(expense);
  Inputmask({
    alias: 'currency',
    autoUnmask: true,
    prefix: "$"
  }).mask(div.querySelector("[data-type='cost']"));
	expenseContainer.appendChild(div);

  updateTotals();
}

function addIncome (income, incomeKey) {
  const template = require('./templates/incomes.handlebars');
  const div = document.createElement('div');
  const key = incomeKey || usersRef.push().key;

  div.id = key;
  div.classList.add('income');
	div.innerHTML = template(income);
  updateSalaryLabels(div.querySelector("input[type='range']"));
	incomeContainer.appendChild(div);

  addRow(income, key);
  updateTotals();
}

function addRow (income, key) {
  const template = require('./templates/row.handlebars');
  const div = document.createElement('div');

  div.classList.add('row');
  div.setAttribute('data-income-id', key);

	div.innerHTML = template(income);
	rowContainer.appendChild(div);
}

function clearUI () {
  toggleAccountLinks();
  localStorage.removeItem('budget');
  chart.destroy();
  breakdownTotal.innerHTML = "";
  expenseContainer.innerHTML = "";
  incomeContainer.innerHTML = "";
  rowContainer.innerHTML = "";
}

function removeExpense (target) {
  const allExpenseRows = document.querySelectorAll('.expense');
  const expenseRow = target.closest('.expense');
  const expenseKey = expenseRow.id;

  deleteJson('expenses', expenseKey);
  expenseRow.parentNode.removeChild(expenseRow);

  updateTotals();
}

function toggleAccountLinks () {
  accountCreate.closest('li').classList.toggle('hidden');
  accountLogin.closest('li').classList.toggle('hidden');
  accountSignout.closest('li').classList.toggle('hidden');
}

function updateChart(data) {
  chart.data.datasets[0].data = data;
  chart.update();
}

function updateExpense(target) {
  const expenseRow = target.closest('.expense');
  const expenseKey = expenseRow.id;
  const name = target.getAttribute('data-type');
  const value = target.value;

  updateJson(value, name, 'expenses', expenseKey);
}

function updateSalary(target) {
  const incomeRow = target.closest('.income');
  const incomeKey = incomeRow.id;
  const value = target.value;

  updateJson(value, 'amount', 'incomes', incomeKey);
}

function updateSalaryLabels(target) {
  const incomeRow = target.closest('.income');
  const incomeDisplay = incomeRow.querySelector('h4');

  incomeDisplay.innerHTML = formatter.format(target.value);
}

function updateTotals() {
  const costInputs = document.querySelectorAll("[data-type='cost']");
  const incomeInputs = document.querySelectorAll("input[type='range']");

  let incomeTotal = 0;
  for (let incomeInput of incomeInputs) {
    incomeTotal += +incomeInput.value;
  }

  let expenseTotal = 0;
  for (let expenseInput of costInputs) {
    expenseTotal += +expenseInput.value;
  }

  breakdownTotal.innerHTML = formatter.format(expenseTotal);

  let data = [];
  for (let incomeInput of incomeInputs) {
    const incomeRow = incomeInput.closest('.income');
    const incomeKey = incomeRow.id;
    const share = +incomeInput.value / incomeTotal;
    const row = document.querySelector(`[data-income-id=${incomeKey}]`);
    const rowShare = row.querySelector('.row-share');
    const rowTotal = row.querySelector('.row-total');

    rowShare.innerHTML = (share * 100).toFixed(0) + '%';
    rowTotal.innerHTML = formatter.format(expenseTotal * share);

    data.push(share);
  }

  updateChart(data);
}

// Event listeners
function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

document.addEventListener('click', function (e) {
  if (e.target.matches('.account-create')) {
    e.preventDefault();
    auth();
  }

  if (e.target.matches('.account-signout')) {
    e.preventDefault();
    firebaseApp.auth().signOut().then(function() {
      clearUI();
    }, function(error) {
      console.error(error);
    });
  }

  if (e.target.matches('.add')) {
    e.preventDefault();
    addExpense();
  }

  if (e.target.matches('.remove')) {
    e.preventDefault();
    removeExpense(e.target);
  }

  if (e.target.matches('.login-backdrop')) {
    e.preventDefault();
    loginContainer.classList.add('hidden');
  }
});

document.addEventListener('input', debounce(function(e){
  if (e.target.matches("input[type='range']")) {
    updateSalary(e.target);
  }
}, 200));

addListenerMulti(document, 'input', function(e){
  if (e.target.matches("input[type='range']")) {
     updateSalaryLabels(e.target);
     updateTotals();
  }
});

addListenerMulti(document, 'change paste keyup', debounce(function(e){
  if (e.target.matches('[data-type]')) {
    updateExpense(e.target);
  }
}, 200));

addListenerMulti(document, 'change paste keyup', function(e){
  if (e.target.matches("[data-type='cost']")) {
     updateTotals();
  }
});
