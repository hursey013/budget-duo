import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function withLeaveWarning(Component) {
  class WithLeaveWarning extends React.Component {
    componentDidMount() {
      window.addEventListener('beforeunload', this.beforeunload);
    }

    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.beforeunload);
    }

    beforeunload = e => {
      const { isDirty } = this.props;

      if (isDirty) {
        e.preventDefault();
        e.returnValue = true;
      }
    };

    render() {
      return <Component {...this.props} />;
    }
  }

  WithLeaveWarning.propTypes = {
    isDirty: PropTypes.bool.isRequired
  };

  const mapStateToProps = ({ session }) => ({
    isDirty: session.isDirty
  });

  return connect(mapStateToProps)(WithLeaveWarning);
}

export default withLeaveWarning;
