import React from "react";
import { ReactSSRPluginOptions } from "../plugins/react-ssr";
import { string } from "joi";

const SEMANTIC_STYLESHEET = (
  <link
    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
    key="semantic"
    rel="stylesheet"
  />
);

const getElements = (
  manifest: Record<string, string>
): React.ReactElement[] => {
  const elements: React.ReactElement[] = [];

  for (const [key, asset] of Object.entries(manifest)) {
    if (/\.css$/.test(asset)) {
      elements.push(<link href={asset} key={key} type="stylesheet" />);
    } else if (/\.js$/.test(asset)) {
      elements.push(<script key={key} src={asset} />);
    }
  }

  return elements;
};

/**
 * Application-specific template options.
 */
export const getTemplateOptions = (): ReactSSRPluginOptions["template"] => {
  if (process.env.NODE_ENV === "production") {
    const manifest: Record<
      string,
      string
    > = require("../../src/dist/manifest.json");

    return { head: [SEMANTIC_STYLESHEET, ...getElements(manifest)] };
  } else {
    return {
      head(request) {
        /**
         * Webpack-dev-middleware mutates the `res` object with stats for SSR
         * {@link} https://github.com/webpack/webpack-dev-middleware#server-side-rendering
         */
        const stats = (request.raw.res as any).locals.webpackStats.toJson();
        // Hot module updates arrive as `string[]`:
        const assetsByChunkName = stats.assetsByChunkName as Record<
          string,
          string | string[]
        >;

        const manifest = Object.keys(assetsByChunkName).reduce<
          Record<string, string>
        >((memo, key) => {
          const value = assetsByChunkName[key];

          if (Array.isArray(value)) {
            return Object.assign(
              {},
              memo,
              ...value.map((v, i) => ({
                [`${key}${i}`]: `${stats.publicPath}${v}`
              })),
              memo
            );
          }

          return Object.assign({}, memo, {
            [key]: `${stats.publicPath}${value}`
          });
        }, {});

        return [SEMANTIC_STYLESHEET, ...getElements(manifest)];
      }
    };
  }
};
