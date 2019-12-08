import { UPDATE_SPLIT } from '../actions/split';
import { UPDATE_INCOME } from '../actions/incomes';
import { UPDATE_EXPENSE, DELETE_EXPENSE } from '../actions/expenses';
import { isDirty } from '../actions/session';

export const session = ({ dispatch, getState }) => next => action => {
  const actions = [UPDATE_SPLIT, UPDATE_INCOME, UPDATE_EXPENSE, DELETE_EXPENSE];

  if (actions.includes(action.type) && !getState().session.isDirty) {
    dispatch(isDirty(true));
  }

  return next(action);
};
