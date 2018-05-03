import { firebaseApp, usersRef } from './config'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui'

const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());

ui.start('#firebaseui-auth-container', {
  autoUpgradeAnonymousUsers: true,
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      return true;
    },
    signInFailure: function(error) {
      const anon = firebaseApp.auth().currentUser;
      const cred = error.credential;
      
      if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
        return Promise.resolve();
      }

      usersRef.child(anon.uid).remove().then(function() {
        anon.delete().then(function() {
          firebase.auth().signInWithCredential(cred).then(function() {
            window.location.assign('/');
          }).catch(function(error) {
            console.error(error);
          });
        }).catch(function(error) {
          console.error(error);
        });
      }).catch(function(error) {
        console.error(error);
      });
    }
  }
});

