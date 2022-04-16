import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Customers from './customers/pages/Customers';
import Questions from './questions/pages/Questions';
import QuestionsByCustomer from './questions/pages/QuestionsByCustomer';
import NewCustomer from './customers/pages/NewCustomer';
import Auth from './staff/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import UpdateQuestion from './questions/pages/UpdateQuestion';
import UpdateCustomer from './customers/pages/UpdateCustomer';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback(uid => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/customers" exact>
          <Customers />
        </Route>
        <Route path="/questions" exact>
          <Questions />
        </Route>
        <Route path="/cusomters/add" exact>
          <NewCustomer />
        </Route>
        <Route path="/questions/:questionId" exact>
          <UpdateQuestion />
        </Route>
        <Route path="/customers/:customerId" exact>
          <UpdateCustomer />
        </Route>
        <Route path="/questions/customer/:customerId" exact>
          <QuestionsByCustomer />
        </Route>
        <Redirect to="/customers" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
