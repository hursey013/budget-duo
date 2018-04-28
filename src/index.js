import './stylesheets/styles.scss'

import Chart from 'chart.js';
import debounce from 'debounce';
import * as firebase from 'firebase';
import Inputmask from 'inputmask';

import { ref, usersRef, buildChart, formatter } from './config'
import sample from './sample';

const breakdownTotal = document.querySelector('.breakdown-total');
const chartContainer = document.getElementById('chart');
const expenseContainer = document.querySelector('.expenses');
const incomeContainer = document.querySelector('.incomes');
const rowContainer = document.querySelector('.rows');

// Initilize
let uid;
const chart = buildChart(chartContainer);
buildUI(sample);

// Functions
function buildUI (budget) {
  const expenses = budget.expenses;
  const incomes = budget.incomes;

  Object.keys(incomes).forEach(incomeKey => {
    addIncome(incomes[incomeKey], incomeKey);
  });

  Object.keys(expenses).forEach(expenseKey => {
    addExpense(expenses[expenseKey], expenseKey);
  });
}

function addExpense (expense, expenseKey) {
  const template = require('./templates/expenses.handlebars');
  const div = document.createElement('div');
  const key = uid ? expenseKey : usersRef.child('expenses').push().key;

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
  const key = uid ? incomeKey : usersRef.child('incomes').push().key;

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

function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

function removeExpense (target) {
  const allExpenseRows = document.querySelectorAll('.expense');
  const expenseRow = target.closest('.expense');
  const expenseKey = expenseRow.id;

  if (allExpenseRows.length > 1) {
    if (uid) usersRef.child(uid).child('expenses').child(expenseKey).remove();
    expenseRow.parentNode.removeChild(expenseRow);

    updateTotals();
  } else {
    expenseRow.querySelector("[data-type='item']").value='';
    expenseRow.querySelector("[data-type='cost']").value='';

    updateTotals();
  }
}

function updateChart(data) {
  chart.data.datasets[0].data = data;
  chart.update();
}

function updateExpense(target) {
  const expenseRow = target.closest('.expense');
  const expenseKey = expenseRow.id;
  const name = target.getAttribute('data-type');
  const object = {};
  const value = target.value;

  object[name] = value;
  usersRef.child(uid).child('expenses').child(expenseKey).update(object);
}

function updateSalary(target) {
  const name = target.id;
  const object = {};
  const value = target.value;

  object[name] = value;
  usersRef.child(uid).update(object);
}

function updateSalaryLabels(target) {
  const incomeRow = target.closest('.income');
  const incomeLabel = incomeRow.querySelector('h4');

  incomeLabel.innerHTML = formatter.format(target.value);
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
document.addEventListener('click', function (e) {
  if (e.target.matches('.add')) {
    e.preventDefault();
    addExpense();
  }

  if (e.target.matches('.remove')) {
    e.preventDefault();
    removeExpense(e.target);
  }
});

// document.addEventListener('input', debounce(function(e){
//   if (e.target.matches("input[type='range']")) {
//     if (uid) { updateSalary(e.target); }
//   }
// }, 200));

addListenerMulti(document, 'input', function(e){
  if (e.target.matches("input[type='range']")) {
     updateSalaryLabels(e.target);
     updateTotals();
  }
});

// addListenerMulti(document, 'change paste keyup', debounce(function(e){
//   if (e.target.matches('[data-type]')) {
//     if (uid) { updateExpense(e.target); }
//   }
// }, 200));

addListenerMulti(document, 'change paste keyup', function(e){
  if (e.target.matches("[data-type='cost']")) {
     updateTotals();
  }
});
