import React from "react";
import { ServerRoute } from "hapi";

import { App } from "../components/app";

export const routes: ServerRoute[] = [
  {
    handler(request, h) {
      return h.react(<App />);
    },
    method: "GET",
    path: "/"
  }
];
