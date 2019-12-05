import Dinero from 'dinero.js';

const toDinero = (amount, factor = Math.pow(10, 2)) => {
  return Dinero({ amount: Math.round(amount * factor) });
};

export const toPercentage = number => {
  return number.toLocaleString('en', {
    style: 'percent'
  });
};

export const totalValues = values => {
  const obj = Object.keys(values)
    .filter(key => values[key].value)
    .reduce((prev, key) => {
      return prev.add(toDinero(values[key].value));
    }, Dinero());
  return obj;
};

export const arrayToFirebaseObject = (array, firebase) => {
  return array.reduce((obj, item) => {
    const key = firebase.key();
    return {
      ...obj,
      [key]: item
    };
  }, {});
};

const filterExpensesByPayer = (expenses, key) => {
  return Object.keys(expenses)
    .filter(k => expenses[k].payer === key)
    .reduce((obj, k) => {
      return {
        ...obj,
        [k]: expenses[k]
      };
    }, {});
};

export const calculatePercentage = (key, income, incomes, expenses, split) => {
  switch (split) {
    case 'half':
      return 0.5;
    case 'adhoc':
      return (
        totalValues(filterExpensesByPayer(expenses, key)).getAmount() /
          totalValues(expenses).getAmount() || 0
      );
    default:
      return (
        toDinero(income).getAmount() / totalValues(incomes).getAmount() || 0
      );
  }
};

export const calculateAmount = (key, income, incomes, expenses, split) => {
  const totalExpenses = totalValues(expenses);

  switch (split) {
    case 'half':
      return totalExpenses.divide(2);
    case 'adhoc':
      return totalValues(filterExpensesByPayer(expenses, key));
    default:
      return totalExpenses.multiply(
        toDinero(income).getAmount() / totalValues(incomes).getAmount() || 0
      );
  }
};
