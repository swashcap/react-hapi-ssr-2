import React from "react";
import { renderToNodeStream } from "react-dom/server";
import multistream from "multistream";
import { PassThrough, Readable } from "stream";

export interface TemplateOptions {
  bodyProperties?: string;
  content?: React.ReactNode;
  description?: string;
  head?: React.ReactNode;
  htmlProperties?: string;
  title?: string;
}

/**
 * A stream for `<!doctype` as it isn't supported in React:
 * {@link https://github.com/facebook/react/issues/1035}
 */
const doctype = () => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push("<!doctype html>");
  readable.push(null);
  return readable;
};

export const template = ({
  bodyProperties,
  content,
  description,
  head,
  htmlProperties,
  title
}: TemplateOptions = {}) => {
  const passThrough = new PassThrough();

  multistream([
    doctype(),
    renderToNodeStream(
      <html {...htmlProperties}>
        <head>
          <meta name="charset" content="utf-8" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {head}
        </head>
        <body {...bodyProperties}>
          <div id="content">{content}</div>
        </body>
      </html>
    )
  ]).pipe(passThrough);

  return passThrough;
};
