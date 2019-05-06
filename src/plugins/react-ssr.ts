import joi from "joi";
import { DecorationMethod, Plugin, Request, ResponseToolkit } from "hapi";

import { TemplateOptions, template } from "../utils/template";

type Options = Pick<TemplateOptions, Exclude<keyof TemplateOptions, "content">>;
type OptionsFn = (request: Readonly<Request>) => Options;

export type ReactSSRPluginTemplateOptions = Options | OptionsFn;

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

schemas.template = joi.alternatives().try(
  joi.func(),
  joi.object({
    afterContent: joi.object(),
    beforeContent: joi.object(),
    bodyProperties: joi.string(),
    description: joi.string(),
    head: joi.object(),
    htmlProperties: joi.string(),
    title: joi.string()
  })
);

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

      debugger;
      return this.response(
        template(
          Object.assign(
            {},
            typeof options.template === "function"
              ? options.template(this.request)
              : options.template,
            typeof handlerOptions === "function"
              ? handlerOptions(this.request)
              : handlerOptions,
            { content }
          )
        )
      ).type("text/html");
    };

    server.decorate("toolkit", "react", method);
  }
};
