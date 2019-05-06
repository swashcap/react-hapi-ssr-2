import React from "react";
import { Container } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";

import { About } from "./pages/about";
import { Footer } from "./footer";
import { Header } from "./header";
import { Home } from "./pages/home";

export const App = () => (
  <React.Fragment>
    <Header />
    <Container>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={About} path="/about" />
      </Switch>
    </Container>
    <Footer />
  </React.Fragment>
);
