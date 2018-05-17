module.exports = function(option, value) {
  if (option == value) {
    return ' selected';
  } else {
    return '';
  }
};
