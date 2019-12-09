import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import * as ROUTES from '../constants/routes';
import Home from './Home';
import SignIn from './SignIn';

const App = () => (
  <Router>
    <Switch>
      <Route exact path={ROUTES.HOME} component={Home} />
      <Route path={ROUTES.SIGN_IN} component={SignIn} />
      <Route component={Home} />
    </Switch>
  </Router>
);

export default App;
