import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebaseui from 'firebaseui';
import { WaveLoading } from 'styled-spinkit';

import { withFirebase } from './Firebase';
import { isRedirect } from '../actions/session';
import { ReactComponent as Logo } from '../images/logo.svg';

const AuthContainer = styled.div`
  ${tw`w-full`}

  .firebaseui-id-page-callback {
    min-height: ${props => (props.isRedirect ? 0 : '200px')};
  }

  .firebaseui-callback-indicator-container {
    height: ${props => (props.isRedirect ? 0 : '120px')};

    .firebaseui-busy-indicator {
      ${tw`hidden`}
    }
  }
`;

class SignIn extends Component {
  componentDidUpdate() {
    const { state } = this.props;
    const { expenses, incomes, split, session } = state;

    if (!session.isRedirect && Object.keys(incomes).length < 1) {
      this.props.history.push('/');
    }

    if (!session.isRedirect) {
      localStorage.setItem(
        'budgetDuoState',
        JSON.stringify({
          incomes,
          expenses,
          split
        })
      );
    }
  }

  componentWillUnmount() {
    const { onRedirect } = this.props;

    onRedirect(false);
  }

  uiConfig = {
    signInOptions: [
      this.props.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      this.props.firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      {
        provider: this.props.firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
      }
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    callbacks: {
      signInSuccessWithAuthResult: authResult => {
        const user = authResult.user;
        const isNewUser = authResult.additionalUserInfo.isNewUser;

        isNewUser &&
          this.props.firebase.user(user.uid).set({
            ...JSON.parse(localStorage.getItem('budgetDuoState')),
            lastSaved: this.props.firebase.timestamp()
          });

        this.props.history.push('/');
      }
    }
  };

  render() {
    const { state, firebase, onRedirect } = this.props;

    return (
      <div css={tw`h-full flex flex-col items-center justify-center`}>
        <Link to="/" css={tw`mb-4`}>
          <h1>
            <Logo />
          </h1>
        </Link>
        {state.session.isRedirect && <WaveLoading color="#fff" />}
        <AuthContainer isRedirect={state.session.isRedirect}>
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.authFn}
            uiCallback={ui => onRedirect(ui.isPendingRedirect())}
          />
        </AuthContainer>
      </div>
    );
  }
}

SignIn.propTypes = {
  state: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  onRedirect: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onRedirect: value => dispatch(isRedirect(value))
});

const mapStateToProps = state => ({
  state
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFirebase(withRouter(SignIn)));
