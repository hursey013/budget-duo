import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import 'styled-components/macro';

const Select = ({ name, onChange, value, options }) => (
  <div css={tw`relative`}>
    <select
      css={tw`block appearance-none w-full bg-white shadow p-3 pr-8 rounded leading-tight`}
      onChange={onChange}
      value={value}
      name={name}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
    <div
      css={tw`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2`}
    >
      <svg
        css={tw`fill-current h-4 w-4`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
);

Select.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired
    })
  ).isRequired
};

export default Select;
