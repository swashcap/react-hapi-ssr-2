import joi from "joi";
import { DecorationMethod, Plugin, Request, ResponseToolkit } from "hapi";

import { TemplateOptions, template } from "../utils/template";

type ReactSSRPluginTemplateFn<T> = (request: Readonly<Request>) => T;

// TODO: Figure out alt value types
interface ReactSSRPluginTemplateOptions {
  bodyProperties?: string | ReactSSRPluginTemplateFn<string>;
  description?: string | ReactSSRPluginTemplateFn<string>;
  head?: React.ReactNode | ReactSSRPluginTemplateFn<React.ReactNode>;
  htmlProperties?: string | ReactSSRPluginTemplateFn<string>;
  title?: string | ReactSSRPluginTemplateFn<string>;
}

/**
 * Add types for the response toolkit decorator.
 *
 * @todo Move to declaration file
 *
 * {@link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/ee9bf2dc97503cd297058bfe8d69477bca89a4a1/types/vision/index.d.ts#L228-L242}
 */
declare module "hapi" {
  interface ResponseToolkit {
    react(
      content: React.ReactNode,
      handlerOptions?: ReactSSRPluginTemplateOptions
    ): ResponseObject;
  }
}

export interface ReactSSRPluginOptions {
  template?: ReactSSRPluginTemplateOptions;
}

const schemas: Record<string, joi.AnySchema> = {};

schemas.template = joi.object({
  bodyProperties: [joi.func(), joi.string()],
  description: [joi.func(), joi.string()],
  head: joi.any(),
  htmlProperties: [joi.func(), joi.string()],
  title: [joi.func(), joi.string()]
});

schemas.plugin = joi.object({
  template: schemas.template
});

export const reactSSRPlugin: Plugin<ReactSSRPluginOptions> = {
  name: "reactSSR",
  register(server, options) {
    joi.assert(options, schemas.plugin);

    const method: DecorationMethod<ResponseToolkit> = function reactSSRHandler(
      content: React.ReactNode,
      handlerOptions?: ReactSSRPluginTemplateOptions
    ) {
      joi.assert(handlerOptions, schemas.template);
      const localOptions = Object.assign({}, options.template, handlerOptions);
      const appliedOptions = Object.keys(localOptions).reduce<TemplateOptions>(
        (memo, key) => {
          const name = key as keyof typeof localOptions;
          const value = localOptions[name];
          memo[name] =
            value && typeof value === "function" ? value(this.request) : value;
          return memo;
        },
        {}
      );

      return this.response(
        template(Object.assign(appliedOptions, { content }))
      ).type("text/html");
    };

    server.decorate("toolkit", "react", method);
  }
};
