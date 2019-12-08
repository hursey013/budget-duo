export const RECEIVE_EXPENSES = 'RECEIVE_EXPENSES';
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const UPDATE_EXPENSE = 'UPDATE_EXPENSE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';

export const receiveExpenses = (expenses = {}) => ({
  type: RECEIVE_EXPENSES,
  expenses
});

export const addExpense = ({ key, name = '', payer }) => ({
  type: ADD_EXPENSE,
  payload: { key, name, payer }
});

export const updateExpense = (key, value) => ({
  type: UPDATE_EXPENSE,
  payload: { key, value }
});

export const deleteExpense = key => ({
  type: DELETE_EXPENSE,
  key
});
