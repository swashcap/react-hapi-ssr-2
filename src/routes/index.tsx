import React from "react";
import { ServerRoute } from "hapi";
import { StaticRouter } from "react-router-dom";

import { App } from "../components/app";

export const routes: ServerRoute[] = [
  {
    handler(request, h) {
      return h.react(
        <StaticRouter location={request.path}>
          <App />
        </StaticRouter>
      );
    },
    method: "GET",
    path: "/{any*}"
  }
];
