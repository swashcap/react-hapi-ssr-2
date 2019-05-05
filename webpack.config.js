const path = require("path");
const WebpackManifestPlugin = require("webpack-manifest-plugin");

const isEnvProd = process.env.NODE_ENV === "production";

module.exports = {
  devtool: "source-map",
  entry: "./src/ui/index.tsx",
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
  plugins: [new WebpackManifestPlugin()],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  }
};
