import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { CSSTransitionGroup } from 'react-transition-group';

const Group = styled(CSSTransitionGroup)`
  .enter {
    opacity: 0.01;
  }

  .enter.enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }

  .leave {
    opacity: 1;
  }

  .leave.leave-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }
`;

const TransitionGroup = ({ children }) => {
  return (
    <Group
      transitionName={{
        enter: 'enter',
        leave: 'leave',
        appear: 'appear'
      }}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
    >
      {children}
    </Group>
  );
};

TransitionGroup.propTypes = {
  children: PropTypes.node
};

export default TransitionGroup;
