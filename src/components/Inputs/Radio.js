import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';

const StyledRadio = styled.div`
  input[type='radio']:checked + label > span {
    ${tw`bg-teal`}
    box-shadow: 0px 0px 0px 4px white inset;
  }
`;

const Radio = ({ checked, option, onChange }) => (
  <StyledRadio>
    <input
      type="radio"
      value={option.value}
      css={tw`hidden`}
      onChange={onChange}
      checked={checked}
      id={`split-${option.value}`}
    />
    <label htmlFor={`split-${option.value}`} css={tw`flex cursor-pointer`}>
      <span
        css={tw`w-5 h-5 block mt-px mr-2 rounded-full border border-teal flex-none`}
      ></span>
      <div>
        <span css={tw`font-bold`}>{option.name}</span>
        {checked && <p css={tw`text-sm`}>{option.description}</p>}
      </div>
    </label>
  </StyledRadio>
);

Radio.propTypes = {
  checked: PropTypes.bool.isRequired,
  option: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Radio;
