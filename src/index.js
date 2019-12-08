import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './tailwind.js';
import { Provider } from 'react-redux';

import './tailwind.css';
import configureStore from './store';
import * as serviceWorker from './serviceWorker';
import Firebase, { FirebaseContext } from './components/Firebase';
import GlobalStyle from './components/GlobalStyle';
import App from './components/App';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={configureStore()}>
    <FirebaseContext.Provider value={new Firebase()}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </FirebaseContext.Provider>
  </Provider>,
  rootElement
);

serviceWorker.unregister();
