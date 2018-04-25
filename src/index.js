import './stylesheets/styles.scss'

import Chart from 'chart.js';
import { colors } from '../tailwind.js';
import debounce from 'debounce';
import * as firebase from 'firebase';
import Inputmask from 'inputmask';
import sample from './sample';

// DOM elements
const breakdownTotal = document.querySelector('.breakdown-total');
const breakdownYourShare = document.querySelector('.breakdown-your-share');
const breakdownYourTotal = document.querySelector('.breakdown-your-total');
const breakdownPartnerShare = document.querySelector('.breakdown-partner-share');
const breakdownPartnerTotal = document.querySelector('.breakdown-partner-total');
const breakdownAnnualIncome = document.querySelector('.breakdown-annual-income');
const breakdownAnnualExpenses = document.querySelector('.breakdown-annual-expenses');
const breakdownEmergency = document.querySelector('.breakdown-emergency');
const chartContainer = document.getElementById('chart');
const expenseContainer = document.querySelector('.expenses');
const partnerSalaryInput = document.querySelector('#partnerSalary');
const partnerSalaryDisplay = document.querySelector('.display-income-partner')
const yourSalaryInput = document.querySelector('#yourSalary');
const yourSalaryDisplay = document.querySelector('.display-income-yours')

// Global objects

// Firebase
const config = {
  apiKey: "AIzaSyDf1-oIWKTncDjyR17WC6BN_9xNInLPIfU",
  authDomain: "budgetduo.firebaseapp.com",
  databaseURL: "https://budgetduo.firebaseio.com",
  projectId: "budgetduo",
  storageBucket: "budgetduo.appspot.com",
  messagingSenderId: "726238323023"
};
firebase.initializeApp(config);
const budgetsRef = firebase.database().ref().child('budgets');

// Chart.js
const chart = new Chart(chartContainer, {
  type: 'pie',
  data: {
    labels: ['Your share', 'Partner\'s share'],
    datasets: [{ backgroundColor: [colors['blue'], colors['blue-light']] }]
  },
  options: {
    legend: { display: false},
    responsive: true,
    maintainAspectRatio: true,
    tooltips: { enabled: false },
    hover: { mode: null }
  }
});

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

// Initialization functions
let key;

init();

function init () {
  getHashKey();

  if (key) {
    budgetsRef.child(key).once('value').then(function(snapshot) {
      const object = snapshot.val();
      object ? buildUI(object) : newBudget();
    });
  } else {
    newBudget();
  }
}

function buildUI (budget) {
  const expenses = budget.expenses;

  yourSalaryInput.value = budget.yourSalary;
  partnerSalaryInput.value = budget.partnerSalary;

  updateSalaryLabels();

  Object.keys(expenses).forEach(expenseKey => {
    addExpense(expenses[expenseKey], expenseKey);
  });
}

// Utility functions
function newBudget () {
  const push = budgetsRef.push({
    yourSalary: sample.yourSalary,
    partnerSalary: sample.partnerSalary
  });

  setHashKey(push.key);

  sample.expenses.forEach(function(expense) {
    budgetsRef.child(key).child('expenses').push(expense);
  });

  budgetsRef.child(key).once('value').then(function(snapshot) {
    buildUI(snapshot.val());
  });
}

// Functions
function addExpense (expense, expenseKey) {
  const template = require('./templates/expenses.handlebars');
  const div = document.createElement('div');

  div.id = expenseKey || pushExpense({item: '', cost: ''}).key;
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

function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

function getHashKey () {
  key = location.hash.substring(1);
}

function pushExpense (expense) {
  const push = budgetsRef.child(key).child('expenses').push(expense);
  return push;
}

function removeExpense (target) {
  const allExpenseRows = document.querySelectorAll('.expense');
  const expenseRow = target.closest('.expense');
  const expenseKey = expenseRow.id;

  if (allExpenseRows.length > 1) {
    budgetsRef.child(key).child('expenses').child(expenseKey).remove();
    expenseRow.parentNode.removeChild(expenseRow);

    updateTotals();
  } else {
    expenseRow.querySelector("[data-type='item']").value='';
    expenseRow.querySelector("[data-type='cost']").value='';

    updateTotals();
  }
}

function setHashKey (newKey) {
  key = newKey;
  location.hash = key;
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
  budgetsRef.child(key).child('expenses').child(expenseKey).update(object);
}

function updateSalary(target) {
  const name = target.id;
  const object = {};
  const value = target.value;

  object[name] = value;
  budgetsRef.child(key).update(object);
}

function updateSalaryLabels() {
  yourSalaryDisplay.innerHTML = formatter.format(yourSalaryInput.value);
  partnerSalaryDisplay.innerHTML = formatter.format(partnerSalaryInput.value);
}

function updateTotals() {
  const yourSalary = Number(yourSalaryInput.value);
  const partnerSalary = Number(partnerSalaryInput.value);
  const totalIncome = yourSalary + partnerSalary;
  const yourShare = yourSalary / totalIncome;
  const partnerShare = partnerSalary / totalIncome;
  const costInputs = document.querySelectorAll("[data-type='cost']");

  let total = 0;
  for (let input of costInputs) {
    total += Number(input.value);
  }

  breakdownTotal.innerHTML = formatter.format(total);
  breakdownYourShare.innerHTML = (yourShare * 100).toFixed(0) + '%';
  breakdownYourTotal.innerHTML = formatter.format(total * yourShare);
  breakdownPartnerShare.innerHTML = (partnerShare * 100).toFixed(0) + '%';
  breakdownPartnerTotal.innerHTML = formatter.format(total * partnerShare);
  breakdownAnnualIncome.innerHTML = formatter.format(totalIncome);
  breakdownAnnualExpenses.innerHTML = formatter.format(total * 12);
  breakdownEmergency.innerHTML = formatter.format(total * 3);

  updateChart([yourShare, partnerShare]);
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

document.addEventListener('input', debounce(function(e){
  if (e.target.matches("input[type='range']")) {
    updateSalary(e.target);
  }
}, 200));

addListenerMulti(document, 'input', function(e){
  if (e.target.matches("input[type='range']")) {
     updateSalaryLabels();
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
