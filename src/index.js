import './styles.scss'

import Chart from 'chart.js';
import Inputmask from 'inputmask';

// Global vars
const ctx = document.getElementById('chart');
const chart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Your share', 'Partner\'s share'],
    datasets: [{ backgroundColor: ['#3490DC', '#6CB2EB'] }]
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

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const partnerSalaryInput = document.querySelector('#income-partner');
const partnerSalaryDisplay = document.querySelector('.display-income-partner')
const yourSalaryInput = document.querySelector('#income-yours');
const yourSalaryDisplay = document.querySelector('.display-income-yours')

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

// Functions
function init () {

  // Initalize salary sliders
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
  const template = require('./expenses.handlebars');
  const div = document.createElement('div');
  const expenseContainer = document.querySelector('.expenses');

	div.innerHTML = template(context);
	expenseContainer.appendChild(div);

  // Apply input mask
  const costInputs = document.querySelectorAll('.cost');
  Inputmask({
    alias: 'currency',
    'autoUnmask': true
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

  document.querySelector('.breakdown-total').innerHTML = formatter.format(total);
  document.querySelector('.breakdown-your-share').innerHTML = (yourShare * 100).toFixed(0) + '%';
  document.querySelector('.breakdown-your-total').innerHTML = formatter.format(total * yourShare);
  document.querySelector('.breakdown-partner-share').innerHTML = (partnerShare * 100).toFixed(0) + '%';
  document.querySelector('.breakdown-partner-total').innerHTML = formatter.format(total * partnerShare);
  document.querySelector('.breakdown-annual-income').innerHTML = formatter.format(totalIncome);
  document.querySelector('.breakdown-annual-expenses').innerHTML = formatter.format(total * 12);
  document.querySelector('.breakdown-emergency').innerHTML = formatter.format(total * 3);

  updateChart([yourShare, partnerShare]);
}
