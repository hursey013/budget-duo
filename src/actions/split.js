export const RECEIVE_SPLIT = 'RECEIVE_SPLIT';
export const UPDATE_SPLIT = 'UPDATE_SPLIT';
export const RESET_SPLIT = 'RESET_SPLIT';

export const receiveSplit = split => ({
  type: RECEIVE_SPLIT,
  split
});

export const updateSplit = split => ({
  type: UPDATE_SPLIT,
  split
});

export const resetSplit = () => ({
  type: RESET_SPLIT
});
