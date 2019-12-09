import {
  AUTH_USER_SET,
  IS_REDIRECT,
  IS_DIRTY,
  IS_SAVING
} from '../actions/session';

const initialState = {
  isRedirect: false,
  isDirty: false,
  isSaving: false
};

export default function session(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER_SET:
      return {
        ...state,
        authUser: action.authUser
      };
    case IS_REDIRECT:
      return {
        ...state,
        isRedirect: action.isRedirect
      };
    case IS_DIRTY:
      return {
        ...state,
        isDirty: action.isDirty
      };
    case IS_SAVING:
      return {
        ...state,
        isSaving: action.isSaving
      };
    default:
      return state;
  }
}
