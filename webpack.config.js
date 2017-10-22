const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
  devtool: "inline-source-map",
  entry: [path.resolve("./src/index.js")],
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/templates/index.ejs",
      inject: true,
    }),
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ["babel-loader"] },
      { test: /\.glsl$/, exclude: /node_modules/, loaders: ["raw-loader"] },
    ],
  },
};
