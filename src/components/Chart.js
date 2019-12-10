import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import PieChart from 'react-minimal-pie-chart';

import { calculatePercentage } from '../helpers';

const Chart = ({ incomes, expenses, split, theme }) => (
  <PieChart
    data={Object.keys(incomes)
      .sort()
      .map((key, index) => ({
        title: incomes[key].name,
        value: calculatePercentage(
          key,
          incomes[key].value,
          incomes,
          expenses,
          split
        ),
        color: Object.values(theme.colors.teal).slice(1)[index]
      }))}
    lineWidth={45}
    paddingAngle={2}
    startAngle={-90}
    animate
  />
);

Chart.propTypes = {
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

export default connect(mapStateToProps)(withTheme(Chart));
