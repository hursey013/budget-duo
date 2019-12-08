export const AUTH_USER_SET = 'AUTH_USER_SET';
export const IS_DIRTY = 'IS_DIRTY';
export const IS_LOADING = 'IS_LOADING';
export const IS_REDIRECT = 'IS_REDIRECT';
export const IS_SAVING = 'IS_SAVING';

export const authUserSet = authUser => ({
  type: AUTH_USER_SET,
  authUser
});

export const isDirty = isDirty => ({
  type: IS_DIRTY,
  isDirty
});

export const isLoading = isLoading => ({
  type: IS_LOADING,
  isLoading
});

export const isRedirect = isRedirect => ({
  type: IS_REDIRECT,
  isRedirect
});

export const isSaving = isSaving => ({
  type: IS_SAVING,
  isSaving
});
