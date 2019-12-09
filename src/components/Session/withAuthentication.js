import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withFirebase } from '../Firebase';
import { authUserSet } from '../../actions/session';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const { firebase, onSetAuthUser } = this.props;

      this.listener = firebase.onAuthStateChanged(authUser => {
        if (authUser) {
          onSetAuthUser(authUser);
        } else {
          onSetAuthUser(null);
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  WithAuthentication.propTypes = {
    firebase: PropTypes.object.isRequired,
    onSetAuthUser: PropTypes.func.isRequired
  };

  const mapDispatchToProps = dispatch => ({
    onSetAuthUser: authUser => {
      dispatch(authUserSet(authUser));
    }
  });

  return connect(null, mapDispatchToProps)(withFirebase(WithAuthentication));
};

export default withAuthentication;
