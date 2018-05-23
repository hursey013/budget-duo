module.exports = function(option, value) {
  if (option && option === value) {
    return ' selected';
  }
  return '';
};
