import { RECEIVE_SPLIT, UPDATE_SPLIT, RESET_SPLIT } from '../actions/split';
import { DEFAULT_SPLIT } from '../constants/misc';

const initialState = DEFAULT_SPLIT;

export default function split(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_SPLIT:
      return action.split;
    case UPDATE_SPLIT:
      return action.split;
    case RESET_SPLIT:
      return initialState;
    default:
      return state;
  }
}
