import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Contact from "./contact/pages/Contact";
import About from "./about/pages/About";

const App = () => {
  let routes;

  routes = (
    <Switch>
      <Route path="/" exact>
        <Contact />
      </Route>
      <Route path="/about" exact>
        <About />
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  return (
    <Router>
      <MainNavigation />
      <main>{routes}</main>
    </Router>
  );
};

export default App;
