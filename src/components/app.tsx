import React from "react";
import { Container, Header, Menu } from "semantic-ui-react";

export const App = () => (
  <Container>
    <Menu inverted>
      <Menu.Item header>React Hapi SSR 2</Menu.Item>
      <Menu.Item>Sample Link</Menu.Item>
    </Menu>
    <Header as="h1">Hello, world!</Header>
  </Container>
);
