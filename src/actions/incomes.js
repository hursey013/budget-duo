export const RECEIVE_INCOMES = 'RECEIVE_INCOMES';
export const UPDATE_INCOME = 'UPDATE_INCOME';

export const receiveIncomes = (incomes = {}) => ({
  type: RECEIVE_INCOMES,
  incomes
});

export const updateIncome = (key, value) => ({
  type: UPDATE_INCOME,
  payload: { key, value }
});
