import React from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrate } from "react-dom";

import { App } from "../components/app";
import { APP_ID } from "../utils/app-id";

import "../components/footer.css";
import "../components/header.css";

const render = () => {
  const el = document.getElementById(APP_ID);

  debugger;
  if (el) {
    hydrate(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      el
    );
  }
};

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
}

render();
