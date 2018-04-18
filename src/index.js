import './styles.scss'

import Chart from 'chart.js';
import Inputmask from 'inputmask';

var ctx = document.getElementById("myChart");
var chart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Your share', 'Partner\'s share'],
    datasets: [{ backgroundColor: ['#3490DC', '#6CB2EB'] }]
  },
  options: {
    legend: { display: false},
    responsive: true,
    maintainAspectRatio: true
  }
});

var defaultExpenses = [
  {item: 'Electricity', cost: 104},
  {item: 'Insurance', cost: 95},
  {item: 'Internet', cost: 29.99},
  {item: 'Gym', cost: 86},
  {item: 'Mortgage', cost: 1848.32},
  {item: 'Savings', cost: 200.00},
  {item: 'Water', cost: 60},

];

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

var split = false;

function init () {

  // Initalize salary sliders
  updateSalaries();

  // Populate default expenses
  for(var expense in defaultExpenses){
    var context = {
      item: defaultExpenses[expense].item,
      cost: defaultExpenses[expense].cost
    };

    addExpense(context);
  }

  // Apply input masks to currency fields
  Inputmask({
    alias: 'currency',
    'autoUnmask': true
  }).mask(document.querySelectorAll('.js-cost'));
}

$(function() {
  init();
});

$('.add').on('click', function(e) {
  e.preventDefault();
  addExpense();
});

$('.expenses').on('change paste keyup', '.js-cost', function(e) {
  updateTotals();
});

$('.expenses').on('click', '.remove', function(e) {
  e.preventDefault();
  removeExpense($(this));
});

$("input[type='range']").on('input', function() {
  updateSalaries();
});

$('.split').on('click', function(e) {
  e.preventDefault();

  var text = $(this).find('span').find('span');

  split = !split;
  split ? text.html("income based") : text.html("50/50");

  updateTotals();
});

function addExpense (context) {
  var template = require('./expenses.handlebars');
  var newListItemHTML = template(context);

  $('.expenses').append(newListItemHTML);
  updateTotals();
}

function removeExpense (target) {
  target.closest('.expense').remove();
  updateTotals();
}

function updateChart(data) {
    chart.data.datasets[0].data = data;
    chart.update();
}

function updateSalaries() {
  var yourSalary = Number($('#income-yours').val());
  var partnerSalary = Number($('#income-partner').val());

  $('.show-income-yours').html(formatter.format(yourSalary));
  $('.show-income-partner').html(formatter.format(partnerSalary));

  updateTotals();
}

function updateTotals() {
  var total = 0;
  var yourSalary = Number($('#income-yours').val());
  var partnerSalary = Number($('#income-partner').val());
  var totalSalary = yourSalary + partnerSalary;
  var yourShare = split ? .5 : (yourSalary / totalSalary);
  var partnerShare = split ? .5 : (partnerSalary / totalSalary);
  var data = [yourShare, partnerShare];

  $('.js-cost').each(function() {
    total += Number($(this).val());
  });

  $('.js-total').html(formatter.format(total));
  $('.js-your-share').html((yourShare * 100).toFixed(0) + '%');
  $('.js-your-total').html(formatter.format(total * yourShare));
  $('.js-partner-share').html((partnerShare * 100).toFixed(0) + '%');
  $('.js-partner-total').html(formatter.format(total * partnerShare));
  $('.js-emergency').html(formatter.format(total * 3));

  updateChart(data);
}
