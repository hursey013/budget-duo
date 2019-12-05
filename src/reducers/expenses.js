import {
  RECEIVE_EXPENSES,
  ADD_EXPENSE,
  UPDATE_EXPENSE,
  DELETE_EXPENSE
} from '../actions/expenses';

export default function expenses(state = {}, action) {
  switch (action.type) {
    case RECEIVE_EXPENSES:
      return action.expenses;
    case ADD_EXPENSE:
      const { key, ...rest } = action.payload;
      return {
        ...state,
        [key]: rest
      };
    case UPDATE_EXPENSE:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          ...action.payload.value
        }
      };
    case DELETE_EXPENSE:
      const { [action.key]: _, ...result } = state;
      return result;
    default:
      return state;
  }
}
