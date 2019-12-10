import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import 'styled-components/macro';
import NumberFormat from 'react-number-format';

import Input from './Input';

const Currency = ({ onValueChange, value }) => {
  return (
    <div css={tw`flex items-center`}>
      <div
        css={tw`bg-grey-light p-3 rounded-tl rounded-bl shadow leading-tight`}
      >
        $
      </div>
      <NumberFormat
        customInput={Input}
        allowNegative={false}
        thousandSeparator=","
        decimalScale={2}
        css={tw`rounded-l-none rounded-r text-right min-w-0`}
        maxLength="20"
        onValueChange={onValueChange}
        value={value}
        inputMode="decimal"
      />
    </div>
  );
};

Currency.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  value: PropTypes.number
};

export default Currency;
