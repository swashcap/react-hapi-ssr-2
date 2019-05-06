const path = require("path");
const webpack = require("webpack");
const WebpackManifestPlugin = require("webpack-manifest-plugin");

const isEnvProd = process.env.NODE_ENV === "production";

module.exports = {
  devtool: "source-map",
  entry: [
    !isEnvProd &&
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    "./src/ui/index.tsx"
  ].filter(Boolean),
  mode: isEnvProd ? "production" : "development",
  module: {
    rules: [
      {
        loader: "awesome-typescript-loader",
        options: {
          silent: true,
          useCache: true
        },
        test: /\.tsx?$/
      },
      {
        enforce: "pre",
        loader: "source-map-loader",
        test: /\.js$/
      }
    ]
  },
  output: {
    filename: isEnvProd ? "[name].[hash].js" : "[name].js",
    path: path.join(__dirname, "dist"),
    publicPath: ""
  },
  plugins: [
    !isEnvProd && new webpack.HotModuleReplacementPlugin(),
    new WebpackManifestPlugin()
  ].filter(Boolean),
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  }
};
