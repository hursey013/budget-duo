import Chart from 'chart.js';
import { colors } from '../tailwind.js';
import * as firebase from 'firebase';

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
export const ref = firebaseApp.database().ref();
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
