import React from "react";
import { hydrate } from "react-dom";

import { App } from "../components/app";
import { APP_ID } from "../utils/app-id";

const render = () => {
  const el = document.getElementById(APP_ID);

  if (el) {
    hydrate(<App />, el);
  }
};

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
}

render();
