import Chart from 'chart.js';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import * as firebaseui from 'firebaseui';
import Inputmask from 'inputmask/dist/inputmask/inputmask.numeric.extensions';

// Firebase
const config = {
  apiKey: 'AIzaSyA0JpI9LaYlDbZAbw3IU2bLbEHKaV6KJJs',
  authDomain: 'budget-duo.firebaseapp.com',
  databaseURL: 'https://budget-duo.firebaseio.com',
  projectId: 'budget-duo',
  storageBucket: 'budget-duo.appspot.com',
  messagingSenderId: '190994851509',
};

export const firebaseApp = firebase.initializeApp(config);
export const usersRef = firebaseApp
  .database()
  .ref()
  .child('users');
export const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());
export const uiConfig = {
  signInSuccessUrl: '/',
  callbacks: {
    uiChanged(fromPageId) {
      if (fromPageId === 'callback') {
        document.querySelector('.loader').classList.add('hidden');
      }
    }
  },
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
};

// Chart.js
export const colors = ['#2AD9C2', '#00A1A7'];
export const buildChart = (cntnr, labels) =>
  new Chart(cntnr, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ backgroundColor: colors }],
    },
    options: {
      legend: { display: false },
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const label = data.labels[tooltipItem.index];
            const currentValue = dataset.data[tooltipItem.index];
            const percentage = parseFloat((currentValue * 100).toFixed(0));

            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  });

export const inputmask = new Inputmask({
    alias: 'currency',
    allowMinus: false,
    autoUnmask: true,
    prefix: '',
  });

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
