import React from "react";
import path from "path";
import { ReactSSRPluginTemplateOptions } from "../plugins/react-ssr";

const SEMANTIC_STYLESHEET = (
  <link
    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
    key="semantic"
    rel="stylesheet"
  />
);

const getElements = (manifest: Record<string, string>) => {
  const scripts: React.ReactElement[] = [];
  const styles: React.ReactElement[] = [];

  for (const [key, asset] of Object.entries(manifest)) {
    if (/\.css$/.test(asset)) {
      styles.push(<link href={asset} key={key} type="stylesheet" />);
    } else if (/\.js$/.test(asset)) {
      scripts.push(<script key={key} src={asset} />);
    }
  }

  return { scripts, styles };
};

/**
 * Application-specific template options.
 */
export const getTemplateOptions = (): ReactSSRPluginTemplateOptions => {
  if (process.env.NODE_ENV === "production") {
    const manifest: Record<string, string> = require(path.join(
      require("../../webpack.config").output.path,
      "manifest.json"
    ));
    const { scripts, styles } = getElements(manifest);

    return {
      afterContent: scripts,
      head: [SEMANTIC_STYLESHEET, ...styles]
    };
  } else {
    return request => {
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

      const { scripts, styles } = getElements(manifest);

      return {
        afterContent: scripts,
        head: [SEMANTIC_STYLESHEET, ...styles]
      };
    };
  }
};
