import React from "react";
import { Container, Header as SemanticUIHeader } from "semantic-ui-react";

import { Footer } from "./footer";
import { Header } from "./header";

export const App = () => (
  <React.Fragment>
    <Header />
    <Container>
      <SemanticUIHeader as="h1">Hello, world!</SemanticUIHeader>
    </Container>
    <Footer />
  </React.Fragment>
);
