import 'babel-polyfill';
import 'element-closest';

import './images/logo_360x360.png';
import './stylesheets/styles.scss';
import * as config from './config';
import sample from './sample.json';

const accountSignin = document.querySelector('.signin');
const accountSignout = document.querySelector('.signout');
const chartContainer = document.getElementById('chart');
const expenseContainer = document.getElementById('expenses');
const expenseWrapper = document.getElementById('expenses-wrapper');
const incomeContainer = document.getElementById('incomes');
const mainPage = document.getElementById('main');
const notification = document.getElementById('notification');
const pages = document.querySelectorAll('.page');
const reportTotal = document.querySelector('.report-total');
const reportTotalBiweekly = document.querySelector('.report-total-biweekly');
const reportTotalBimonthly = document.querySelector('.report-total-bimonthly');
const reportTotalAnnually = document.querySelector('.report-total-annually');
const rowContainer = document.getElementById('rows');
const rowTotalContainer = document.getElementById('row-total');
const splitContainer = document.getElementById('split');
const splitIncome = document.getElementById('split-income');

// Auth
let currentUid = null;

config.firebaseApp.auth().onAuthStateChanged(user => {
  if (user && currentUid === user.uid) {
    return;
  }

  if (user) {
    currentUid = user.uid;

    config.usersRef
      .child(currentUid)
      .once('value')
      .then(snapshot => {
        const budget = snapshot.val();

        budget ? buildUI(budget) : buildUI(pushLocalBudget());
      });
  } else {
    currentUid = null;

    buildUI(setLocalBudget(), true);
  }
});

// Initialize
function buildUI(budget, persistStorage) {
  const expensesArray = budget.expenses;
  const incomesArray = budget.incomes;
  const splitType = budget.split;

  clearUI(persistStorage);

  const labels = [];
  Object.keys(incomesArray).forEach(income => {
    labels.push(incomesArray[income].name);
  });
  window.chart = config.buildChart(chartContainer, labels);

  if (splitType) {
    const radio = splitContainer.querySelector(`input[value=${splitType}]`);

    radio.checked = true;
    setSplitType(splitType);
  }

  if (incomesArray) {
    Object.keys(incomesArray).forEach((key, index) => {
      addDomElement(incomesArray[key], createKey(key), incomeContainer, index);
      addDomElement(incomesArray[key], null, rowContainer, index);
    });
  }

  if (expensesArray) {
    Object.keys(expensesArray).forEach((key, index) => {
      addDomElement(
        expensesArray[key],
        createKey(key),
        expenseContainer,
        index
      );
    });
  }

  updateTotals();
}

function clearUI(persistStorage) {
  const rows = rowContainer.querySelectorAll('.row');

  if (!persistStorage) localStorage.removeItem('budget');

  for (const row of rows) {
    row.classList.remove('expanded');
  }
  rowTotalContainer.classList.add('expanded');

  toggleSignInLinks();

  setSplitType('income');
  splitIncome.checked = true;

  reportTotal.innerHTML = '';
  expenseContainer.innerHTML = '';
  incomeContainer.innerHTML = '';
  rowContainer.innerHTML = '';
}

function pushLocalBudget() {
  const budget = JSON.parse(localStorage.getItem('budget'));

  config.usersRef.child(currentUid).set(budget);
  return budget;
}

function setLocalBudget() {
  const arrayToObject = array =>
    array.reduce((obj, item) => {
      const newObj = obj;
      newObj[config.usersRef.push().key] = item;
      return newObj;
    }, {});
  const budget = {};

  budget.incomes = arrayToObject(sample.incomes);
  budget.expenses = arrayToObject(sample.expenses);
  localStorage.setItem('budget', JSON.stringify(budget));
  return budget;
}

// Misc
function addDomElement(object, key, parent, index) {
  const context = object;
  const div = document.createElement('div');
  const type = parent.id;
  const template = require(`./templates/${type}.handlebars`); // eslint-disable-line import/no-dynamic-require

  if (isNumeric(index)) context.index = index;

  div.innerHTML = template(context);
  div.classList.add('animated', 'fadeIn');
  const currencyInput = div.querySelector("[data-type='currency']");

  if (key) div.id = key;
  if (currencyInput) config.inputmask.mask(currencyInput);

  parent.appendChild(div);
}

function auth() {
  config.ui.start('#firebaseui-auth-container', config.uiConfig);
}

function calcTotal(total, share, interval) {
  let newTotal = total;
  newTotal = interval ? newTotal * 12 / interval : newTotal;
  if (isNumeric(share)) {
    newTotal *= share;
  }

  return config.formatter.format(newTotal);
}

function createKey(key) {
  return key || config.usersRef.push().key;
}

function getTotal(inputs, index) {
  let total = 0;
  for (const input of inputs) {
    if (isNumeric(index)) {
      const select = input.parentNode.parentNode.querySelector('select');
      const option = select.options[select.selectedIndex];

      if (+index === +option.value) {
        total += +input.value;
      }
    } else {
      total += +input.value;
    }
  }

  return total;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function removeBudgetItem(target) {
  const row = target.closest('[id]');
  const type = row.parentNode.id;
  const key = row.id;

  if (currentUid) {
    showNotification('Saving...');

    config.usersRef
      .child(currentUid)
      .child(type)
      .child(key)
      .remove()
      .then(showNotification('All changes saved', 3000));
  } else {
    const item = JSON.parse(localStorage.getItem('budget'));

    delete item[type][key];
    localStorage.setItem('budget', JSON.stringify(item));
  }

  if (expenseContainer.querySelectorAll('[id]').length > 1) {
    row.parentNode.removeChild(row);
    updateTotals();
  } else {
    const inputs = row.querySelectorAll('input');
    for (const input of inputs) {
      row.classList.add('shake');
      input.value = '';
      updateBudgetItem(input);
    }
  }
}

function renderUI() {
  const hash = window.location.hash.substring(1);
  const ids = [];

  for (const page of pages) {
    if (hash === page.id) {
      page.classList.remove('hidden');
      if (hash === 'login') auth();
    } else {
      page.classList.add('hidden');
    }
    ids.push(page.id);
  }

  if (hash === '' || !ids.includes(hash)) {
    mainPage.classList.remove('hidden');
  }
}

function setSplitType(value) {
  expenseWrapper.className = `split-${value}`;
}

function showNotification(message, timeout) {
  notification.classList.add('lg:inline-block', 'fadeIn');

  if (timeout) {
    setTimeout(() => {
      notification.innerHTML = message;
    }, 3000);
  } else {
    notification.innerHTML = message;
  }
}

function toggleSignInLinks() {
  if (currentUid) {
    accountSignin.closest('li').classList.add('hidden');
    accountSignout.closest('li').classList.remove('hidden');
  } else {
    accountSignin.closest('li').classList.remove('hidden');
    accountSignout.closest('li').classList.add('hidden');
  }
}

function updateBudgetItem(target) {
  const parent = target.closest('[id]');
  const key = parent.id;
  const desc = target.name;
  const type = parent.parentNode.id;

  let val;
  if (target.nodeName === 'SELECT') {
    const option = target.options[target.selectedIndex];
    val = +option.value;
  } else if (isNumeric(target.value)){
    val = +target.value;
  } else {
    val = target.value;
  }

  if (currentUid) {
    const item = {};

    showNotification('Saving...');

    item[desc] = val;
    config.usersRef
      .child(currentUid)
      .child(type)
      .child(key)
      .update(item)
      .then(showNotification('All changes saved', 3000));
  } else {
    const budget = JSON.parse(localStorage.getItem('budget'));

    !(key in budget[type]) && (budget[type][key] = {});
    budget[type][key][desc] = val;
    localStorage.setItem('budget', JSON.stringify(budget));
  }

  updateTotals();
}

function updateChart(data) {
  window.chart.data.datasets[0].data = data;
  window.chart.update();
}

function updateSalaryInputs(target) {
  const row = target.closest('[id]');
  const input = target.type === 'range' ? 'tel' : 'range';

  row.querySelector(`input[type='${input}']`).value = target.value;
}

function updateSplitType(target) {
  const key = target.name;
  const val = target.value;

  if (currentUid) {
    showNotification('Saving...');

    config.usersRef
      .child(currentUid)
      .child(key)
      .set(val)
      .then(showNotification('All changes saved', 3000));
  } else {
    const budget = JSON.parse(localStorage.getItem('budget'));

    budget[key] = val;
    localStorage.setItem('budget', JSON.stringify(budget));
  }

  setSplitType(val);
  updateTotals();
}

function updateTotals() {
  const expenseInputs = expenseContainer.querySelectorAll(
    "[data-type='currency']"
  );
  const incomeInputs = incomeContainer.querySelectorAll(
    "[data-type='currency']"
  );
  const expenseTotal = getTotal(expenseInputs);
  const incomeTotal = getTotal(incomeInputs);
  const splitType = document.querySelector("input[name='split']:checked").value;

  reportTotal.innerHTML = calcTotal(expenseTotal);
  reportTotalBiweekly.innerHTML = calcTotal(expenseTotal, 1, 26);
  reportTotalBimonthly.innerHTML = calcTotal(expenseTotal, 1, 24);
  reportTotalAnnually.innerHTML = calcTotal(expenseTotal, 1, 1);

  const data = [];
  for (const [index, incomeInput] of incomeInputs.entries()) {
    const row = document.querySelectorAll('#rows>div');
    const rowShare = row[index].querySelector('.row-share');
    const rowTotal = row[index].querySelector('.row-total');
    const rowTotalBiweekly = row[index].querySelector('.row-total-biweekly');
    const rowTotalBimonthly = row[index].querySelector('.row-total-bimonthly');
    const rowTotalAnnually = row[index].querySelector('.row-total-annually');

    let share;
    if (splitType === 'half') {
      share = 0.5;
    } else if (splitType === 'adhoc') {
      share = getTotal(expenseInputs, index) / +expenseTotal || 0;
    } else {
      share = +incomeInput.value / +incomeTotal;
    }

    rowShare.innerHTML = `${(share * 100).toFixed(0)}%`;
    rowTotal.innerHTML = calcTotal(expenseTotal, share);
    rowTotalBiweekly.innerHTML = calcTotal(expenseTotal, share, 26);
    rowTotalBimonthly.innerHTML = calcTotal(expenseTotal, share, 24);
    rowTotalAnnually.innerHTML = calcTotal(expenseTotal, share, 1);

    data.push(share);
  }

  updateChart(data);
}

// Event listeners
function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

document.addEventListener('click', e => {
  if (e.target.matches('.add')) {
    e.preventDefault();
    addDomElement(null, createKey(), expenseContainer);
  }

  if (e.target.closest('.row')) {
    e.preventDefault();
    e.target.closest('.row').classList.toggle('expanded');
  }

  if (e.target.matches('.remove')) {
    e.preventDefault();
    removeBudgetItem(e.target);
  }

  if (e.target.matches('.signin')) {
    e.preventDefault();
    window.location.hash = 'login';
  }

  if (e.target.matches('.signout')) {
    e.preventDefault();
    config.firebaseApp.auth().signOut();
  }
});

document.addEventListener('change', e => {
  if (e.target.matches('select')) {
    updateBudgetItem(e.target);
  }

  if (e.target.matches("input[type='radio']")) {
    updateSplitType(e.target);
  }
});

addListenerMulti(window, 'hashchange load', () => {
  renderUI();
});

addListenerMulti(document, 'change input', e => {
  if (e.target.matches("#incomes input[type='range']")) {
    updateBudgetItem(e.target);
    updateSalaryInputs(e.target);
  }
});

addListenerMulti(document, 'change paste keyup', e => {
  if (e.target.matches('#expenses input')) {
    updateBudgetItem(e.target);
  }

  if (e.target.matches("#incomes input[data-type='currency']")) {
    updateBudgetItem(e.target);
    updateSalaryInputs(e.target);
  }
});

addListenerMulti(
  document,
  'webkitAnimationEnd oanimationend msAnimationEnd animationend',
  e => {
    if (e.target.matches('.animated')) {
      e.target.classList.remove('fadeIn', 'shake');
    }
  }
);
