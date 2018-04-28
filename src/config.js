import Chart from 'chart.js';
import { colors } from '../tailwind.js';
import * as firebase from 'firebase';

// Firebase
const config = {
  apiKey: "AIzaSyDf1-oIWKTncDjyR17WC6BN_9xNInLPIfU",
  authDomain: "budgetduo.firebaseapp.com",
  databaseURL: "https://budgetduo.firebaseio.com",
  projectId: "budgetduo",
  storageBucket: "budgetduo.appspot.com",
  messagingSenderId: "726238323023"
};
firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const usersRef = ref.child('users');

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
