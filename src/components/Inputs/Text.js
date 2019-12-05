import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

const Text = props => <Input {...props} />;

Text.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default Text;
