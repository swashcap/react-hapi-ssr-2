import joi from "joi";
import webpack from "webpack";
import { Plugin } from "hapi";
import webpackDevMiddleware, { Options } from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { NextHandleFunction } from "connect";

export interface WebpackPluginOptions {
  webpackConfig: webpack.Configuration;
}

const schemas = {
  // Don't run in production!
  env: joi.any().invalid("production"),
  plugin: joi
    .object({
      webpackConfig: joi
        .object({
          // webpack-dev-middleware requires `publicPath`
          output: joi
            .object({
              publicPath: joi.string().empty("")
            })
            .unknown()
            .required()
        })
        .unknown()
        .required()
    })
    .required()
};

export const webpackPlugin: Plugin<WebpackPluginOptions> = {
  once: true,
  name: "webpack",
  register(server, options) {
    joi.assert(process.env.NODE_ENV, schemas.env);
    joi.assert(options, schemas.plugin);

    const compiler = webpack(options.webpackConfig);
    const devMiddleware = webpackDevMiddleware(compiler, {
      logger: ({
        error: (...args: any[]) =>
          server.log(["webpack-dev-middleware", "error"], ...args),
        info: (...args: any[]) =>
          server.log(["webpack-dev-middleware", "info"], ...args),
        log: (...args: any[]) =>
          server.log(["webpack-dev-middleware", "log"], ...args),
        trace: (...args: any[]) =>
          server.log(["webpack-dev-middleware", "trace"], ...args),
        warn: (...args: any[]) =>
          server.log(["webpack-dev-middleware", "warn"], ...args)
      } as unknown) as Options["logger"],
      publicPath: options.webpackConfig.output!.publicPath || "",
      serverSideRender: true
    });
    const hotMiddleware = webpackHotMiddleware(compiler, {
      log(message) {
        server.log(["webpack-hot-middleware", "info"], message);
      }
    });
    const getMiddlewareCaller = (middleware: NextHandleFunction) => (
      req: Parameters<NextHandleFunction>[0],
      res: Parameters<NextHandleFunction>[1]
    ) =>
      new Promise((resolve, reject) => {
        middleware(req, res, error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

    const callDevMiddleware = getMiddlewareCaller(devMiddleware);
    const callHotMiddleware = getMiddlewareCaller(hotMiddleware);

    server.ext({
      async method({ raw: { req, res } }, h) {
        await Promise.all([
          callDevMiddleware(req, res),
          callHotMiddleware(req, res)
        ]);

        if (res.finished) {
          return h.response().code(200);
        }

        return h.continue;
      },
      type: "onRequest"
    });
  }
};
