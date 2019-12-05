import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import 'styled-components/macro';
import { connect } from 'react-redux';

import { OPTIONS } from '../constants/options';
import { updateSplit } from '../actions/split';
import Radio from './Inputs/Radio';
import Chart from './Chart';

const Split = ({ split, onUpdateSplit }) => {
  const handleUpdate = event => {
    onUpdateSplit(event.target.value);
  };

  return (
    <>
      <h2 css={tw`text-2xl font-normal mb-4`}>Divide our expenses</h2>
      <div css={tw`flex -mx-2`}>
        <ul css={tw`w-2/3 px-2 list-reset mb-8`}>
          {OPTIONS.map(option => (
            <li key={option.value} css={tw`mb-3`}>
              <Radio
                option={option}
                onChange={handleUpdate}
                checked={split === option.value}
              />
            </li>
          ))}
        </ul>
        <div css={tw`w-1/3 px-2`}>
          <Chart />
        </div>
      </div>
    </>
  );
};

Split.propTypes = {
  split: PropTypes.string.isRequired,
  onUpdateSplit: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onUpdateSplit: value => dispatch(updateSplit(value))
});

const mapStateToProps = ({ split }) => ({
  split
});

export default connect(mapStateToProps, mapDispatchToProps)(Split);
