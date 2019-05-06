import React from "react";
import { Link } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";

export const Header = () => (
  <Container as="header" role="banner">
    <Menu inverted>
      <Menu.Item as={Link} header rel="home" to="/">
        React Hapi SSR 2
      </Menu.Item>
      <Menu.Item as={Link} to="/about">
        About
      </Menu.Item>
    </Menu>
  </Container>
);
