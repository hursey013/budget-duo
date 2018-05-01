import { firebaseApp } from './config'
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'

const uiConfig = {
  autoUpgradeAnonymousUsers: true,
  signInSuccessUrl: '/',
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      return true;
    },
    signInFailure: function(error) {
      if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
        return Promise.resolve();
      }
    }
  },
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    },
  ]
};

const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());

if (ui.isPendingRedirect()) {
  document.getElementById('firebaseui-auth-container').style.display = 'none';
}

ui.start('#firebaseui-auth-container', uiConfig);
