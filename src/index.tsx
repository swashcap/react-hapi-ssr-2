import "hard-rejection/register";

import React from "react";
import good from "good";
import hapi from "hapi";

import { routes } from "./routes/index";
import { reactSSRPlugin } from "./plugins/react-ssr";

export const getServer = async () => {
  const server = new hapi.Server({
    port: 3000
  });

  if (process.env.NODE_ENV !== "test") {
    await server.register({
      options: {
        ops: {
          interval: 1000
        },
        reporters: {
          myConsoleReporter: [
            {
              module: "good-squeeze",
              name: "Squeeze",
              args: [{ log: "*", response: "*" }]
            },
            {
              module: "good-console"
            },
            "stdout"
          ]
        }
      },
      plugin: good
    });
  }

  server.register({
    options: {
      template: {
        head: (
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
        ),
        title: "React Hapi SSR 2"
      }
    },
    plugin: reactSSRPlugin
  });

  server.route(routes);

  return server;
};

if (require.main === module) {
  (async () => {
    const server = await getServer();
    await server.start();
    console.log(`Server listening at: ${server.info.uri}`);
  })();
}
