import './stylesheets/styles.scss';
import * as config from './config';
import sample from './sample.json';

const accountBack = document.querySelector('.account-back');
const accountSignin = document.querySelector('.account-signin');
const accountSignout = document.querySelector('.account-signout');
const chartContainer = document.getElementById('chart');
const expenseContainer = document.getElementById('expenses');
const incomeContainer = document.getElementById('incomes');
const pageApp = document.querySelector('.page-app');
const pageLogin = document.querySelector('.page-login');
const reportTotal = document.querySelector('.report-total');
const reportTotalBiweekly = document.querySelector('.report-total-biweekly');
const reportTotalBimonthly = document.querySelector('.report-total-bimonthly');
const reportTotalAnnually = document.querySelector('.report-total-annually');
const rowContainer = document.getElementById('rows');
const splitContainer = document.getElementById('split');

// Auth
let currentUid = null;

config.firebaseApp.auth().onAuthStateChanged(user => {
  if (config.ui.isPendingRedirect()) {
    auth();
  } else if (user && user.uid !== currentUid) {
    currentUid = user.uid;
    toggleSignInLinks(false);
    config.usersRef
      .child(currentUid)
      .once('value')
      .then(snapshot => {
        const budget = snapshot.val();

        budget ? buildUI(budget) : buildUI(pushLocalBudget());
      });
  } else {
    currentUid = null;
    toggleSignInLinks(true);
    buildUI(setLocalBudget(), true);
  }
});

function auth() {
  pageApp.classList.add('hidden');
  pageLogin.classList.remove('hidden');
  config.ui.start('#firebaseui-auth-container', config.uiConfig);
}

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

  if (currentUid && splitType) {
    const radio = splitContainer.querySelector(`input[value=${splitType}]`);

    radio.checked = true;
    setSplitType(splitType);
  }

  if (incomesArray) {
    Object.keys(incomesArray).forEach((key, i) => {
      addDomElement(incomesArray[key], createKey(key), incomeContainer, i);
      addDomElement(incomesArray[key], null, rowContainer, i);
    });
  }

  if (expensesArray) {
    Object.keys(expensesArray).forEach((key, i) => {
      addDomElement(expensesArray[key], createKey(key), expenseContainer, i);
    });
  }

  updateTotals();

  accountBack.classList.add('hidden');
  pageApp.classList.remove('hidden');
  pageLogin.classList.add('hidden');
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
  const template = require(`./templates/${type}.handlebars`); // eslint-disable-line global-require, import/no-dynamic-require

  if (typeof index !== 'undefined') context.index = index;

  div.innerHTML = template(context);
  div.classList.add('animated', 'fadeIn');
  const currencyInput = div.querySelector("[data-type='currency']");

  if (key) div.id = key;
  if (currencyInput) config.masker(currencyInput);

  parent.appendChild(div);
}

function calcTotal(total, share, interval) {
  let newTotal = total;
  if (interval) newTotal = interval ? newTotal * 12 / interval : newTotal;
  if (typeof share !== 'undefined') {
    newTotal *= share;
  }

  return config.formatter.format(newTotal);
}

function clearUI(persistStorage) {
  if (!persistStorage) localStorage.removeItem('budget');

  reportTotal.innerHTML = '';
  expenseContainer.innerHTML = '';
  incomeContainer.innerHTML = '';
  rowContainer.innerHTML = '';
}

function createKey(key) {
  return key || config.usersRef.push().key;
}

function getTotal(inputs, index) {
  let total = 0;
  for (const input of inputs) {
    if (typeof index !== 'undefined') {
      const select = input.parentNode.parentNode.querySelector('select');
      const option = select.options[select.selectedIndex];

      if (index === +option.value) {
        total += +input.value;
      }
    } else {
      total += +input.value;
    }
  }
  return total;
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

  if (expenseContainer.querySelectorAll('[id]').length > 1) {
    row.classList.add('fadeOut');
    setTimeout(() => {
      row.parentNode.removeChild(row);
      updateTotals();
    }, 1000);
  } else {
    const inputs = row.querySelectorAll('input');
    for (const input of inputs) {
      row.classList.add('shake');
      input.value = '';
      updateBudgetItem(input);
    }
  }
}

function setSplitType(value) {
  expenseContainer.className = `split-${value}`;
}

function toggleAccordion(parent) {
  if (parent.classList.contains('collapsed')) {
    parent.classList.remove('collapsed');
    parent.classList.add('expanded');
  } else {
    parent.classList.remove('expanded');
    parent.classList.add('collapsed');
  }
}

function toggleSignInLinks(show) {
  accountSignin.closest('li').classList.toggle('hidden', !show);
  accountSignout.closest('li').classList.toggle('hidden', !!show);
}

function updateBudgetItem(target) {
  const parent = target.closest('[id]');
  const key = parent.id;
  const desc = target.name;
  const type = parent.parentNode.id;

  let val;
  if (target.nodeName === 'SELECT') {
    const option = target.options[target.selectedIndex];
    val = option.value;
  } else {
    val = target.value;
  }

  if (currentUid) {
    const item = {};

    item[desc] = val;
    config.usersRef
      .child(currentUid)
      .child(type)
      .child(key)
      .update(item);
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
  const input = target.type === 'range' ? 'text' : 'range';

  row.querySelector(`input[type='${input}']`).value = target.value;
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
      share = getTotal(expenseInputs, index) / expenseTotal;
    } else {
      share = +incomeInput.value / incomeTotal;
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

function updateSplitType(target) {
  const key = target.name;
  const val = target.value;

  if (currentUid) {
    config.usersRef
      .child(currentUid)
      .child(key)
      .set(val);
  } else {
    const budget = JSON.parse(localStorage.getItem('budget'));

    budget[key] = val;
    localStorage.setItem('budget', JSON.stringify(budget));
  }

  setSplitType(val);
  updateTotals();
}

// Event listeners
function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

document.addEventListener('click', e => {
  if (e.target.matches('a[href="#"]')) {
    e.preventDefault();
  }

  if (e.target.matches('.account-back')) {
    e.preventDefault();
    accountBack.classList.add('hidden');
    pageApp.classList.remove('hidden');
    pageLogin.classList.add('hidden');
  }

  if (e.target.matches('.account-signin')) {
    e.preventDefault();
    accountBack.classList.remove('hidden');
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

  if (e.target.matches('.expand')) {
    e.preventDefault();
    toggleAccordion(e.target.parentNode.parentNode);
  }

  if (e.target.matches('.remove')) {
    e.preventDefault();
    removeBudgetItem(e.target);
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

  if (e.target.matches("#incomes input[type='text']")) {
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
