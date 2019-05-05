import React from "react";
import { Container } from "semantic-ui-react";

import { Footer } from "./footer";
import { Header } from "./header";

/**
 * A wrapper for server-side rendering that includes the header, footer, and
 * the application element with `id="app"`.
 */
export const SSRWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children
}) => (
  <React.Fragment>
    <Header />
    <Container id="app">{children}</Container>
    <Footer />
  </React.Fragment>
);
