import Chart from 'chart.js';
import { colors } from '../tailwind.js';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import * as firebaseui from 'firebaseui'

// Firebase
const config = {
  apiKey: "AIzaSyA0JpI9LaYlDbZAbw3IU2bLbEHKaV6KJJs",
  authDomain: "budget-duo.firebaseapp.com",
  databaseURL: "https://budget-duo.firebaseio.com",
  projectId: "budget-duo",
  storageBucket: "budget-duo.appspot.com",
  messagingSenderId: "190994851509"
};

export const firebaseApp = firebase.initializeApp(config)
export const ref = firebaseApp.database().ref();
export const usersRef = ref.child('users');
export const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());
export const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function() {
      document.querySelector('.login-container').classList.add('hidden');
    },
    signInFailure: function() {
      console.log("error");
      document.querySelector('.loader').classList.add('hidden');
    },
    uiShown: function() {
      document.querySelector('.loader').classList.add('hidden');
    }
  },
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    },
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

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
