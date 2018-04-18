import styles from './styles.scss'
import rangesliderJs from 'rangeslider-js'

var defaultExpenses = [
  {item: 'Rent', cost: 1000},
  {item: 'Cable', cost: 40},
  {item: 'Electricity', cost: 100},
  {item: 'Water', cost: 50},
  {item: 'Insurance', cost: 150}
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
});

$('.add').on('click', function(e) {
  e.preventDefault();
  addExpense();
});

$('.expenses').on('click', '.remove', function(e) {
  e.preventDefault();
  var target = $( this );

  removeExpense(target);
});

// $("#myelement").on("input change", function() { doSomething(); });

$( ".salaries input[type='range']" ).change(function() {
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
  var yourSalary = Number($('.your-share').val());

  $('.js-your-salary').html(formatter.format(yourSalary));

}

function updateTotals() {
  var total = 0;
  var yourSalary = Number($('.your-share').val());
  var partnerSalary = Number($('.partner-share').val());
  var totalSalary = yourSalary + partnerSalary;
  var yourShare = yourSalary / totalSalary;
  var partnerShare = partnerSalary / totalSalary;

  $('.js-cost').each(function() {
    total += Number($(this).val());
  });

  $('.js-total').html(formatter.format(total));
  $('.js-your-total').html(formatter.format(total * yourShare));
  $('.js-partner-total').html(formatter.format(total * partnerShare));
}
