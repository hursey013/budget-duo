import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import 'styled-components/macro';
import { connect } from 'react-redux';

import { updateIncome } from '../actions/incomes';
import { withFirebase } from './Firebase';

import Label from './Label';
import Slider from './Inputs/Slider';
import Currency from './Inputs/Currency';

const Row = tw.div`flex items-center`;

const Incomes = ({ incomes, split, onUpdateIncome }) => {
  const handleUpdate = (key, value) => {
    onUpdateIncome(key, value);
  };

  return (
    <>
      <h3 css={tw`text-white text-2xl font-normal mt-8 mb-6`}>Annual income</h3>
      {Object.keys(incomes).map(key => (
        <div css={tw`mb-8`} key={key}>
          <Row css={tw`-mx-1`}>
            <div css={tw`w-6/12 sm:w-7/12 px-1 uppercase text-white`}>
              {incomes[key].name}
            </div>
            <Label css={tw`w-5/12 sm:w-4/12 px-1 mr-auto text-right`}>
              Gross income
            </Label>
          </Row>
          <Row css={tw`-mx-2`}>
            <div css={tw`w-6/12 sm:w-7/12 px-2`}>
              <Slider
                onChange={values => handleUpdate(key, values[0])}
                value={incomes[key].value}
              />
            </div>
            <div css={tw`w-5/12 sm:w-4/12 px-2 mr-auto`}>
              <Currency
                onValueChange={values => handleUpdate(key, values.floatValue)}
                value={incomes[key].value}
              />
            </div>
          </Row>
        </div>
      ))}
    </>
  );
};

Incomes.propTypes = {
  incomes: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  onUpdateIncome: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onUpdateIncome: (key, value) => dispatch(updateIncome(key, value))
});

const mapStateToProps = ({ incomes, split }) => ({
  incomes,
  split
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFirebase(Incomes));
