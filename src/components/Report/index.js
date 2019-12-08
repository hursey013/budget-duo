import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import 'styled-components/macro';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';

import {
  calculatePercentage,
  calculateAmount,
  totalValues
} from '../../helpers';

import Label from '../Label';
import Row from './Row';

const Report = ({ incomes, expenses, split, theme }) => (
  <>
    <h3 css={tw`mb-4 font-normal text-lg`}>
      Great! Here's your contribution breakdown:
    </h3>
    <div
      css={tw`flex items-center flex-wrap w-full pb-2 border-b border-teal text-left`}
    >
      <Label css={tw`w-1/4 px-2`}>Individual</Label>
      <Label css={tw`w-1/4 px-2 text-right`}>
        % <span css={tw`hidden sm:inline`}>of total</span>
      </Label>
      <Label css={tw`w-5/12 px-2 text-right mr-auto`}>Amount due</Label>
    </div>
    {Object.keys(incomes).map((key, index) => (
      <Row
        color={Object.values(theme.colors.teal).slice(1)[index]}
        key={key}
        name={incomes[key].name}
        percentage={calculatePercentage(
          key,
          incomes[key].value,
          incomes,
          expenses,
          split
        )}
        amount={calculateAmount(
          key,
          incomes[key].value,
          incomes,
          expenses,
          split
        )}
      />
    ))}
    <Row
      css={tw`border-none`}
      expanded
      name={<span css={tw`font-bold`}>Total:</span>}
      percentage={1}
      amount={totalValues(expenses)}
    />
  </>
);

Report.propTypes = {
  incomes: PropTypes.object.isRequired,
  expenses: PropTypes.object.isRequired,
  split: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = ({ incomes, expenses, split }) => ({
  incomes,
  expenses,
  split
});

export default connect(mapStateToProps)(withTheme(Report));
