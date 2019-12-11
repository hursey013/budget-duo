import { SAMPLE } from '../constants/sample';
import { receiveIncomes } from './incomes';
import { receiveExpenses } from './expenses';
import { receiveSplit, resetSplit } from './split';
import { arrayToFirebaseObject } from '../helpers';

export const handleFirebaseData = (uid, firebase) => {
  return dispatch => {
    return firebase.user(uid).once('value', snapshot => {
      const { incomes, expenses, split, lastSaved } = snapshot.val();

      dispatch(split ? receiveSplit(split) : resetSplit());
      dispatch(
        receiveIncomes(lastSaved ? incomes : convertLegacyIncomes(incomes))
      );
      dispatch(
        receiveExpenses(
          lastSaved ? expenses : convertLegacyExpenses(expenses, incomes)
        )
      );
    });
  };
};

export const handleSampleData = firebase => (dispatch, getState) => {
  dispatch(resetSplit());
  dispatch(receiveIncomes(arrayToFirebaseObject(SAMPLE.incomes, firebase)));
  dispatch(
    receiveExpenses(
      arrayToFirebaseObject(
        SAMPLE.expenses.map(expense => ({
          ...expense,
          payer: Object.keys(getState().incomes)[0]
        })),
        firebase
      )
    )
  );
};

export const convertLegacyIncomes = incomes => {
  return Object.keys(incomes).reduce((obj, k) => {
    return {
      ...obj,
      [k]: {
        name: incomes[k].name,
        value: incomes[k].value || +incomes[k].amount || null
      }
    };
  }, {});
};

export const convertLegacyExpenses = (expenses, incomes) => {
  return Object.keys(expenses).reduce((obj, k) => {
    return {
      ...obj,
      [k]: {
        name: expenses[k].name || expenses[k].item || '',
        payer: Object.keys(incomes).includes(expenses[k].payer)
          ? expenses[k].payer
          : expenses[k].split == 1 // eslint-disable-line eqeqeq
          ? Object.keys(incomes)[1]
          : Object.keys(incomes)[0],
        value: expenses[k].value || +expenses[k].cost || null
      }
    };
  }, {});
};
