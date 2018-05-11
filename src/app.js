import './stylesheets/styles.scss';

import * as config from './config';
import Inputmask from 'inputmask';
import sample from './sample';

const accountCreate = document.querySelector('.account-create');
const accountSignin = document.querySelector('.account-signin');
const accountSignout = document.querySelector('.account-signout');
const breakdownTotal = document.querySelector('.breakdown-total');
const chartContainer = document.getElementById('chart');
const expenseContainer = document.getElementById('expenses');
const incomeContainer = document.getElementById('incomes');
const loader = document.querySelector('.loader');
const loginContainer = document.querySelector('.login-container');
const rowContainer = document.getElementById('rows');

// Auth
let currentUid = null;

config.firebaseApp.auth().onAuthStateChanged(function(user) {
  if (config.ui.isPendingRedirect()) {
    auth(true);
  } else if (user && user.uid != currentUid) {
    currentUid = user.uid;
    showSignInLinks(false);
    loginContainer.classList.add('hidden');
    config.usersRef
      .child(currentUid)
      .once('value')
      .then(function(snapshot) {
        const budget = snapshot.val();

        budget ? buildUI(budget) : buildUI(pushLocalBudget());
      });
  } else {
    currentUid = null;
    showSignInLinks(true);
    buildUI(setLocalBudget(), true);
  }
});

function auth(pendingRedirect) {
  loginContainer.classList.remove('hidden');
  config.ui.start('#firebaseui-auth-container', config.uiConfig);
  if (pendingRedirect) loader.classList.remove('hidden');
}

// Initialize
function buildUI(budget, persistStorage) {
  const expenses = budget.expenses;
  const incomes = budget.incomes;

  clearUI(persistStorage);

  window.chart = config.buildChart(chartContainer);

  if (incomes) {
    Object.keys(incomes).forEach(incomeKey => {
      addDomElement(incomes[incomeKey], createKey(incomeKey), incomeContainer);
      addDomElement(incomes[incomeKey], null, rowContainer);
    });
  }

  if (expenses) {
    Object.keys(expenses).forEach(expenseKey => {
      addDomElement(
        expenses[expenseKey],
        createKey(expenseKey),
        expenseContainer
      );
    });
  }

  updateTotals();
}

function pushLocalBudget() {
  const budget = JSON.parse(localStorage.getItem('budget'));

  config.usersRef.child(currentUid).set(budget);
  return budget;
}

function setLocalBudget() {
  const arrayToObject = array =>
    array.reduce((obj, item) => {
      obj[config.usersRef.push().key] = item;
      return obj;
    }, {});
  const budget = {};

  budget.incomes = arrayToObject(sample.incomes);
  budget.expenses = arrayToObject(sample.expenses);
  localStorage.setItem('budget', JSON.stringify(budget));
  return budget;
}

// Misc
function addDomElement(object, key, parent) {
  const div = document.createElement('div');
  const type = parent.id;
  const template = require(`./templates/${type}.handlebars`);

  div.innerHTML = template(object);
  const currencyInput = div.querySelector("[data-type='currency']");

  if (key) div.id = key;
  if (currencyInput) {
    Inputmask({
      alias: 'currency',
      autoUnmask: true,
      prefix: '$',
    }).mask(div.querySelector("[data-type='currency']"));
  }
  parent.appendChild(div);
}

function clearUI(persistStorage) {
  if (!persistStorage) localStorage.removeItem('budget');

  breakdownTotal.innerHTML = '';
  expenseContainer.innerHTML = '';
  incomeContainer.innerHTML = '';
  rowContainer.innerHTML = '';
}

function createKey(key) {
  return key || config.usersRef.push().key;
}

function removeBudgetItem(target) {
  const row = target.closest('[id]');
  const type = row.parentNode.id;
  const key = row.id;

  if (currentUid) {
    config.usersRef
      .child(currentUid)
      .child(type)
      .child(key)
      .remove();
  } else {
    const item = JSON.parse(localStorage.getItem('budget'));

    delete item[type][key];
    localStorage.setItem('budget', JSON.stringify(item));
  }
  row.parentNode.removeChild(row);

  updateTotals();
}

function showSignInLinks(show) {
  accountCreate.closest('li').classList.toggle('hidden', show ? false : true);
  accountSignin.closest('li').classList.toggle('hidden', show ? false : true);
  accountSignout.closest('li').classList.toggle('hidden', show ? true : false);
}

function updateBudgetItem(target) {
  const parent = target.closest('[id]');
  const key = parent.id;
  const name = target.name;
  const type = parent.parentNode.id;
  const value = target.value;

  if (currentUid) {
    const item = {};

    item[name] = value;
    config.usersRef
      .child(currentUid)
      .child(type)
      .child(key)
      .update(item);
  } else {
    const budget = JSON.parse(localStorage.getItem('budget'));

    !(key in budget[type]) && (budget[type][key] = {});
    budget[type][key][name] = value;
    localStorage.setItem('budget', JSON.stringify(budget));
  }

  updateTotals();
}

function updateChart(data) {
  chart.data.datasets[0].data = data;
  chart.update();
}

function updateSalaryInputs(target) {
  const row = target.closest('[id]');
  const input = target.type == 'range' ? 'text' : 'range';

  row.querySelector(`input[type='${input}']`).value = target.value;
}

function updateTotals() {
  const costInputs = expenseContainer.querySelectorAll(
    "[data-type='currency']"
  );
  const incomeInputs = incomeContainer.querySelectorAll(
    "[data-type='currency']"
  );
  const splitType = document.querySelector("input[name='split']:checked");

  let incomeTotal = 0;
  for (let incomeInput of incomeInputs) {
    incomeTotal += +incomeInput.value;
  }

  let expenseTotal = 0;
  for (let expenseInput of costInputs) {
    expenseTotal += +expenseInput.value;
  }

  breakdownTotal.innerHTML = config.formatter.format(expenseTotal);

  let data = [];
  for (let [index, incomeInput] of incomeInputs.entries()) {
    const incomeRow = incomeInput.closest('[id]');
    const incomeKey = incomeRow.id;
    const row = document.querySelectorAll('#rows > div');
    const rowShare = row[index].querySelector('.row-share');
    const rowTotal = row[index].querySelector('.row-total');

    let share;

    if (splitType.value == 'half') {
      share = 0.5;
    } else {
      share = +incomeInput.value / incomeTotal;
    }

    rowShare.innerHTML = (share * 100).toFixed(0) + '%';
    rowTotal.innerHTML = config.formatter.format(expenseTotal * share);

    data.push(share);
  }

  updateChart(data);
}

// Event listeners
function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

document.addEventListener('click', function(e) {
  if (e.target.matches('.account-create')) {
    e.preventDefault();
    auth();
  }

  if (e.target.matches('.account-signin')) {
    e.preventDefault();
    auth();
  }

  if (e.target.matches('.account-signout')) {
    e.preventDefault();
    config.firebaseApp.auth().signOut();
  }

  if (e.target.matches('.add')) {
    e.preventDefault();
    addDomElement(null, createKey(), expenseContainer);
  }

  if (e.target.matches('.remove')) {
    e.preventDefault();
    removeBudgetItem(e.target);
  }

  if (e.target.matches('.login-backdrop')) {
    e.preventDefault();
    loginContainer.classList.add('hidden');
  }
});

document.addEventListener('change', function(e) {
  if (e.target.matches("input[type='radio']")) {
    updateTotals();
  }
});

document.addEventListener('input', function(e) {
  if (e.target.matches(".incomes input[type='range']")) {
    updateBudgetItem(e.target);
    updateSalaryInputs(e.target);
  }
});

addListenerMulti(document, 'change paste keyup', function(e) {
  if (e.target.matches('.expenses input')) {
    updateBudgetItem(e.target);
  }

  if (e.target.matches(".incomes input[type='text']")) {
    updateBudgetItem(e.target);
    updateSalaryInputs(e.target);
  }
});
