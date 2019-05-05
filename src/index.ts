import "hard-rejection/register";

import good from "good";
import hapi from "hapi";

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

  return server;
};

if (require.main === module) {
  (async () => {
    const server = await getServer();
    await server.start();
    console.log(`Server listening at: ${server.info.uri}`);
  })();
}
