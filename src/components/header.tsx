import React from "react";
import { Container, Menu } from "semantic-ui-react";

export const Header = () => (
  <Container as="header" role="banner">
    <Menu inverted>
      <Menu.Item header>React Hapi SSR 2</Menu.Item>
      <Menu.Item>Sample Link</Menu.Item>
    </Menu>
  </Container>
);
