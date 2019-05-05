import React from "react";
import { hydrate } from "react-dom";

import { App } from "../components/app";

const render = () => {
  const el = document.getElementById("app");

  if (el) {
    hydrate(<App />, el);
  }
};

render();
