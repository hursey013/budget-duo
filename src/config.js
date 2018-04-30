import Chart from 'chart.js';
import { colors } from '../tailwind.js';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'

// Firebase
const config = {
  apiKey: "AIzaSyA0JpI9LaYlDbZAbw3IU2bLbEHKaV6KJJs",
  authDomain: "budget-duo.firebaseapp.com",
  databaseURL: "https://budget-duo.firebaseio.com",
  projectId: "budget-duo",
  storageBucket: "",
  messagingSenderId: "190994851509"
};
export const firebaseApp = firebase.initializeApp(config);
const ref = firebaseApp.database().ref();
export const usersRef = ref.child('users');

const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());
const uiConfig = {
  autoUpgradeAnonymousUsers: true,
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      return false;
    },
    signInFailure: function(error) {
      // For merge conflicts, the error.code will be
      // 'firebaseui/anonymous-upgrade-merge-conflict'.
      if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
        return Promise.resolve();
      }
      // The credential the user tried to sign in with.
      var cred = error.credential;
      // Copy data from anonymous user to permanent user and delete anonymous
      // user.
      // ...
      // Finish sign-in after data is copied.
      return firebase.auth().signInWithCredential(cred);
    }
  },
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
};

ui.start('#firebaseui-auth-container', uiConfig);

// Chart.js
export const buildChart = cntnr =>
  new Chart(cntnr, {
    type: 'pie',
    data: {
      labels: ['Your share', "Partner's share"],
      datasets: [{ backgroundColor: [colors['blue'], colors['blue-light']] }]
    },
    options: {
      legend: { display: false },
      responsive: true,
      maintainAspectRatio: true,
      tooltips: { enabled: false },
      hover: { mode: null }
    }
  });

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
