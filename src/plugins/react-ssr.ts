import joi from "joi";
import {
  DecorationMethod,
  Plugin,
  ResponseToolkit,
  ResponseObject
} from "hapi";

import { TemplateOptions, template } from "../utils/template";

type TemplateOptionsWithoutContent = Pick<
  TemplateOptions,
  Exclude<keyof TemplateOptions, "content">
>;

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
      handlerOptions?: TemplateOptionsWithoutContent
    ): ResponseObject;
  }
}

export interface ReactSSRPluginOptions {
  template?: TemplateOptionsWithoutContent;
}

const schemas: Record<string, joi.AnySchema> = {};

schemas.template = joi.object({
  bodyProperties: joi.string(),
  description: joi.string(),
  htmlProperties: joi.string(),
  title: joi.string()
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
      handlerOptions?: TemplateOptionsWithoutContent
    ) {
      joi.assert(handlerOptions, schemas.template);

      return this.response(
        template(
          Object.assign({}, options.template, handlerOptions, { content })
        )
      ).type("text/html");
    };

    server.decorate("toolkit", "react", method);
  }
};
