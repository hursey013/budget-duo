import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withFirebase } from '../Firebase';
import { authUserSet, isLoading } from '../../actions/session';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.props.onSetAuthUser(JSON.parse(localStorage.getItem('authUser')));
    }

    componentDidMount() {
      const { firebase, isLoading, onLoading, onSetAuthUser } = this.props;

      this.listener = firebase.onAuthStateChanged(authUser => {
        if (authUser) {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          onSetAuthUser(authUser);
        } else {
          localStorage.removeItem('authUser');
          onSetAuthUser(null);
        }
        isLoading && onLoading(false);
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
    isLoading: PropTypes.bool.isRequired,
    firebase: PropTypes.object.isRequired,
    onLoading: PropTypes.func.isRequired,
    onSetAuthUser: PropTypes.func.isRequired
  };

  const mapDispatchToProps = dispatch => ({
    onSetAuthUser: authUser => {
      dispatch(authUserSet(authUser));
    },
    onLoading: value => dispatch(isLoading(value))
  });

  const mapStateToProps = ({ session }) => ({
    isLoading: session.isLoading
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(withFirebase(WithAuthentication));
};

export default withAuthentication;
