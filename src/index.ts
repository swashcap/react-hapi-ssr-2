import "hard-rejection/register";

import good from "good";
import hapi from "hapi";
import inert from "inert";
import path from "path";

import { routes } from "./routes/index";
import { reactSSRPlugin } from "./plugins/react-ssr";
import { webpackPlugin } from "./plugins/webpack";
import { getTemplateOptions } from "./utils/get-template-options";
import { pathToFileURL } from "url";

const webpackConfig = require("../webpack.config");

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
  if (process.env.NODE_ENV !== "production") {
    await server.register({
      options: {
        webpackConfig
      },
      plugin: webpackPlugin
    });
  } else {
    // TODO: Serve assets from Nginx
    await server.register(inert);

    server.route({
      handler: {
        directory: {
          index: false,
          path: path.resolve(__dirname, "../dist/")
        }
      },
      method: "GET",
      path: `${webpackConfig.output.publicPath}{param*}`
    });
  }

  server.register({
    options: {
      template: getTemplateOptions()
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
    server.log(["server"], `Server listening at: ${server.info.uri}`);
  })();
}
