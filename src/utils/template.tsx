import React from "react";
import intoStream from "into-stream";
import multistream from "multistream";
import { PassThrough } from "stream";
import { renderToNodeStream, renderToStaticNodeStream } from "react-dom/server";
import { AllHtmlEntities } from "html-entities";

import { APP_ID } from "./app-id";

export interface TemplateOptions {
  afterContent?: React.ReactNode;
  beforeContent?: React.ReactNode;
  bodyProperties?: string;
  content?: React.ReactNode;
  description?: string;
  head?: React.ReactNode;
  htmlProperties?: string;
  title?: string;
}

const entities = new AllHtmlEntities();

/**
 * A stream for `<!doctype` as it isn't supported in React:
 * {@link https://github.com/facebook/react/issues/1035}
 */
export const template = ({
  afterContent,
  beforeContent,
  bodyProperties = "",
  content,
  description = "",
  head,
  htmlProperties = "",
  title = ""
}: TemplateOptions = {}) => {
  const passThrough = new PassThrough();
  multistream([
    intoStream(`<!doctype>
<html${entities.encode(htmlProperties)}>
  <head>
    <meta charset="utf-8">
    <title>${entities.encode(title)}</title>
    <meta name="description" content=${entities.encode(description)}>
    <meta name="viewport" content="width=device-width, initial-scale=1" />`),
    renderToStaticNodeStream(<React.Fragment>{head}</React.Fragment>),
    intoStream(`
  </head>
  <body${entities.encode(bodyProperties)}>`),
    renderToStaticNodeStream(<React.Fragment>{beforeContent}</React.Fragment>),
    intoStream(`<div id=${APP_ID}>`),
    renderToNodeStream(<React.Fragment>{content}</React.Fragment>),
    intoStream(`</div>`),
    renderToStaticNodeStream(<React.Fragment>{afterContent}</React.Fragment>),
    intoStream(`
  </body>
</html>`)
  ]).pipe(passThrough);

  return passThrough;
};
