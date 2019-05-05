import React from "react";
import { ServerRoute } from "hapi";

import { App } from "../components/app";
import { SSRWrapper } from "../components/ssr-wrapper";

export const routes: ServerRoute[] = [
  {
    handler(request, h) {
      return h.react(
        <SSRWrapper>
          <App />
        </SSRWrapper>
      );
    },
    method: "GET",
    path: "/"
  }
];
