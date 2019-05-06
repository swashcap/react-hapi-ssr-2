import React from "react";
import { Container, Divider, Grid } from "semantic-ui-react";

export const Footer = () => (
  <Container as="footer" className="footer" role="contentinfo">
    <Divider />
    <Grid columns={2} stackable>
      <Grid.Column>
        <p>
          👋 Hello. This is a demo web application built using{" "}
          <a href="https://reactjs.org">React</a> and{" "}
          <a href="https://semantic-ui.com/">Semantic UI</a>. It is an{" "}
          <a href="https://en.wikipedia.org/wiki/Isomorphic_JavaScript">
            isomorphic JavaScript
          </a>{" "}
          application, with server-side rendering through{" "}
          <a href="https://hapijs.com">hapi</a>.
        </p>
      </Grid.Column>
      <Grid.Column>
        <p>
          Yet another react-hapi-SSR experiment by{" "}
          <a href="http://swashcap.com">Cory Reed</a>. Source code{" "}
          <a href="https://github.com/swashcap/react-hapi-ssr-2">on GitHub</a>.
        </p>
      </Grid.Column>
    </Grid>
  </Container>
);
