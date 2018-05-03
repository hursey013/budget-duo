import { firebaseApp } from './config'
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'

const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());

ui.start('#firebaseui-auth-container', {
  autoUpgradeAnonymousUsers: true,
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    }
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      return true;
    },
    signInFailure: function(error) {
      if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
        return Promise.resolve();
      }

      var anon = firebaseApp.auth().currentUser;
      var cred = error.credential;

      anon.delete().then(function() {
        firebaseApp.auth().signInWithCredential(cred).then(function() {
          window.location.assign('/');
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(function(error) {
        console.log(error);
      });
    }
  }
});

// if (ui.isPendingRedirect()) {
//   document.getElementById('firebaseui-auth-container').style.display = 'none';
// }
