import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import 'styled-components/macro';
import { Range } from 'react-range';

import { MAX_INCOME } from '../../constants/misc';

const Slider = ({ onChange, disabled, value }) => (
  <Range
    step={500}
    min={0}
    max={MAX_INCOME}
    values={[value > MAX_INCOME ? MAX_INCOME : value]}
    onChange={onChange}
    disabled={disabled}
    renderTrack={({ props, children }) => (
      <div
        {...props}
        style={{
          ...props.style,
          ...tw`rounded w-full bg-teal h-1`
        }}
      >
        {children}
      </div>
    )}
    renderThumb={({ props }) => (
      <div
        {...props}
        style={{
          ...props.style,
          ...tw`rounded-full shadow bg-white h-5 w-5`
        }}
      />
    )}
  />
);

Slider.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number
};

export default Slider;
