import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import { toPercentage } from '../../helpers';

class Row extends Component {
  state = {
    expanded: this.props.expanded || false
  };

  handleClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  toPaymentInteval = (amount, interval) => {
    return amount
      .multiply(12)
      .divide(interval)
      .toFormat('$0,0.00');
  };

  render() {
    const { className, amount, percentage, name, color } = this.props;
    const { expanded } = this.state;

    return (
      <button
        css={tw`flex items-center flex-wrap w-full py-4 border-b border-teal text-left`}
        onClick={this.handleClick}
        className={className}
      >
        <span css={tw`w-1/4 px-2 flex items-center`}>
          {color && (
            <span
              css={tw`flex-none rounded-full w-3 h-3 mr-2`}
              style={{ backgroundColor: color }}
            ></span>
          )}
          {name}
        </span>
        <span css={tw`w-1/4 px-2 text-right font-bold`}>
          {toPercentage(percentage)}
        </span>
        <span css={tw`w-5/12 px-2 text-right truncate`}>
          <span css={tw`font-bold`}>{amount.toFormat('$0,0.00')}</span>
          /mo
        </span>
        <span css={tw`w-1/12 px-2 text-right`}>
          <FontAwesomeIcon
            icon={expanded ? faMinus : faPlus}
            css={tw`text-teal fill-current w-3 h-3`}
          />
        </span>
        {expanded && (
          <span css={tw`w-11/12 px-2 text-right text-sm mr-auto`}>
            <div css={tw`py-1`}>
              {this.toPaymentInteval(amount, 26)} / bi-weekly
            </div>
            <div css={tw`py-1`}>
              {this.toPaymentInteval(amount, 24)} / bi-monthly
            </div>
            <div css={tw`py-1`}>
              {this.toPaymentInteval(amount, 1)} / annually
            </div>
          </span>
        )}
      </button>
    );
  }
}

Row.propTypes = {
  className: PropTypes.string,
  expanded: PropTypes.bool,
  color: PropTypes.string,
  amount: PropTypes.object.isRequired,
  percentage: PropTypes.number.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
};

export default Row;
