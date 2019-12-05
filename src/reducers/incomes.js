import { RECEIVE_INCOMES, UPDATE_INCOME } from '../actions/incomes';

export default function incomes(state = {}, action) {
  switch (action.type) {
    case RECEIVE_INCOMES:
      return action.incomes;
    case UPDATE_INCOME:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          value: action.payload.value
        }
      };
    default:
      return state;
  }
}
