import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import * as ROUTES from '../constants/routes';
import { withFirebase } from './Firebase';
import { withAuthentication } from './Session';
import { handleSampleData, handleInitialData } from '../actions/shared';

import Home from './Home';
import SignIn from './SignIn';

class App extends Component {
  componentDidUpdate() {
    const {
      isLoading,
      authUser,
      firebase,
      onHandleInitialData,
      onHandleSampleData
    } = this.props;

    if (isLoading) return;

    authUser
      ? onHandleInitialData(authUser.uid, firebase)
      : onHandleSampleData(firebase);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.SIGN_IN} component={SignIn} />
          <Route component={Home} />
        </Switch>
      </Router>
    );
  }
}

App.propTypes = {
  authUser: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  firebase: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  onHandleInitialData: (uid, firebase) =>
    dispatch(handleInitialData(uid, firebase)),
  onHandleSampleData: firebase => dispatch(handleSampleData(firebase))
});

const mapStateToProps = ({ session }) => ({
  authUser: session.authUser,
  isLoading: session.isLoading
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFirebase(withAuthentication(App)));
