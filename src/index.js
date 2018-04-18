import styles from './styles.scss'
import Inputmask from "inputmask";
import rangesliderJs from 'rangeslider-js'

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

$(function() {
  rangesliderJs.create(document.querySelectorAll('input[type="range"]'));

  for(var expense in defaultExpenses){
    var context = {
      item: defaultExpenses[expense].item,
      cost: defaultExpenses[expense].cost
    };

    addExpense(context);
  }
  Inputmask({ alias: 'currency', 'autoUnmask': true }).mask(document.querySelectorAll('.js-cost'));
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
  var target = $(this);

  removeExpense(target);
});

$( ".salaries input[type='range']" ).on('input', function() {
  updateSalaries();
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

function updateSalaries() {
  var yourSalary = Number($('#income-yours').val());
  var partnerSalary = Number($('#income-partner').val());

  $('.show-income-yours').html(formatter.format(yourSalary));
  $('.show-income-partner').html(formatter.format(partnerSalary));
}

function updateTotals() {
  var total = 0;
  var yourSalary = Number($('#income-yours').val());
  var partnerSalary = Number($('#income-partner').val());
  var totalSalary = yourSalary + partnerSalary;
  var yourShare = yourSalary / totalSalary;
  var partnerShare = partnerSalary / totalSalary;

  $('.js-cost').each(function() {
    total += Number($(this).val());
  });

  $('.js-total').html(formatter.format(total));
  $('.js-your-share').html((yourShare * 100).toFixed(0) + '%');
  $('.js-your-total').html(formatter.format(total * yourShare));
  $('.js-partner-share').html((partnerShare * 100).toFixed(0) + '%');
  $('.js-partner-total').html(formatter.format(total * partnerShare));
}
