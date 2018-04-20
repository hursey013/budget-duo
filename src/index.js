import './stylesheets/styles.scss'

import Chart from 'chart.js';
import { colors } from '../tailwind.js';
import * as firebase from 'firebase';
import Inputmask from 'inputmask';
import queryString from 'query-string';

console.log(colors);

// DOM elements
const breakdownTotal = document.querySelector('.breakdown-total');
const breakdownYourShare = document.querySelector('.breakdown-your-share');
const breakdownYourTotal = document.querySelector('.breakdown-your-total');
const breakdownPartnerShare = document.querySelector('.breakdown-partner-share');
const breakdownPartnerTotal = document.querySelector('.breakdown-partner-total');
const breakdownAnnualIncome = document.querySelector('.breakdown-annual-income');
const breakdownAnnualExpenses = document.querySelector('.breakdown-annual-expenses');
const breakdownEmergency = document.querySelector('.breakdown-emergency');
const ctx = document.getElementById('chart');
const partnerSalaryInput = document.querySelector('#income-partner');
const partnerSalaryDisplay = document.querySelector('.display-income-partner')
const yourSalaryInput = document.querySelector('#income-yours');
const yourSalaryDisplay = document.querySelector('.display-income-yours')

// Global vars
const config = {
  apiKey: "AIzaSyDf1-oIWKTncDjyR17WC6BN_9xNInLPIfU",
  authDomain: "budgetduo.firebaseapp.com",
  databaseURL: "https://budgetduo.firebaseio.com",
  projectId: "budgetduo",
  storageBucket: "budgetduo.appspot.com",
  messagingSenderId: "726238323023"
};
firebase.initializeApp(config);
const database = firebase.database();

const chart = new Chart(ctx, {
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

const defaultExpenses = [
  {item: 'Electricity', cost: 104},
  {item: 'Insurance', cost: 95},
  {item: 'Internet', cost: 29.99},
  {item: 'Gym', cost: 86},
  {item: 'Mortgage', cost: 1848.32},
  {item: 'Savings', cost: 200.00},
  {item: 'Water', cost: 60}
];

const defaultSalary = {
  yourSalary: 40000,
  partnerSalary: 60000
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

// Functions
function init () {
  const parsedHash = queryString.parse(location.hash);

  let initialYourSalary = false;
  let intitalPartnerSalary = false;

  if (parsedHash.token) {
    database.ref('/' + parsedHash.token).once('value').then(function(snapshot) {
      initialYourSalary = snapshot.val().yourSalary;
      intitalPartnerSalary = snapshot.val().partnerSalary;
    });
  } else {

  }

  yourSalaryInput.value = initialYourSalary || defaultSalary.yourSalary;
  partnerSalaryInput.value = intitalPartnerSalary || defaultSalary.partnerSalary;

  updateSalaries();

  // Populate default expenses
  for(let expense in defaultExpenses){
    let context = {
      item: defaultExpenses[expense].item,
      cost: defaultExpenses[expense].cost
    };
    addExpense(context);
  }
}

function addExpense (context) {
  const template = require('./templates/expenses.handlebars');
  const div = document.createElement('div');
  const expenseContainer = document.querySelector('.expenses');

	div.innerHTML = template(context);
	expenseContainer.appendChild(div);

  // Apply input mask
  const costInputs = document.querySelectorAll('.cost');
  Inputmask({
    alias: 'currency',
    autoUnmask: true,
    prefix: "$"
  }).mask(costInputs[costInputs.length - 1]);

  updateTotals();
}

function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

function removeExpense (target) {
  const expenseRow = target.closest('.expense');

  expenseRow.parentNode.removeChild(expenseRow);

  updateTotals();
}

function updateChart(data) {
  chart.data.datasets[0].data = data;
  chart.update();
}

function updateSalaries() {
  yourSalaryDisplay.innerHTML = formatter.format(yourSalaryInput.value);
  partnerSalaryDisplay.innerHTML = formatter.format(partnerSalaryInput.value);

  updateTotals();
}

function updateTotals() {
  const yourSalary = Number(yourSalaryInput.value)
  const partnerSalary = Number(partnerSalaryInput.value)
  const totalIncome = yourSalary + partnerSalary;
  const yourShare = yourSalary / totalIncome;
  const partnerShare = partnerSalary / totalIncome;
  const costInputs = document.querySelectorAll('.cost');

  let total = 0;
  for (let input of costInputs) {
    total += Number(input.value);
  };

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

function outputJSON() {

  const expenses = document.querySelectorAll('.expense');
  const yourSalary = Number(yourSalaryInput.value)
  const partnerSalary = Number(partnerSalaryInput.value)

  let expensesArray = [];

  for (let i = 0; i < expenses.length; i++) {
    let item =  expenses[i].querySelector('.input').value;
    let cost =  expenses[i].querySelector('.cost').value;
    let expense = {
      item: item,
      cost: cost
    }

    expensesArray.push(expense);
  }

  let data = {
    yourSalary: yourSalary,
    partnerSalary: partnerSalary,
    expenses: expensesArray
  }

  let push = database.ref().push(data);
  const stringified = queryString.stringify({token: push.key});
  location.hash = stringified;
}

// Event listeners
document.addEventListener('DOMContentLoaded', init());

document.addEventListener('click', function (e) {
  if (e.target.matches('.add')) {
    e.preventDefault();
    addExpense();
  }

  if (e.target.matches('.remove')) {
    e.preventDefault();
    removeExpense(e.target);
  }

  if (e.target.matches('.test')) {
    e.preventDefault();
    outputJSON();
  }
});

document.addEventListener('input', function (e) {
  if (e.target.matches("input[type='range']")) {
    updateSalaries();
  }
});

addListenerMulti(document, 'change paste keyup', function(e){
  if (e.target.matches('.cost')) {
    updateTotals();
  }
});
