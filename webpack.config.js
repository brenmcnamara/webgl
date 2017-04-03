import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Stylesheets from './utils/Stylesheets';

import path from 'path';

export default {
  debug: true,
  devtool: 'inline-source-map',
  noInfo: false,
  entry: [
    path.resolve(__dirname, 'src/index'),
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/templates/index.ejs',
      inject: true,
      cssFiles: ['/css/blueprint.css']
        .concat(Stylesheets.DistCSSFilesBasename.map(filename => `/css/${filename}`)),
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve('node_modules/@blueprintjs/core/dist/blueprint.css'),
        to: path.resolve('dist/css/blueprint.css'),
      },
      {
        from: path.resolve('node_modules/@blueprintjs/core/dist/blueprint.css.map'),
        to: path.resolve('dist/css/blueprint.css.map'),
      },
    ]),
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
    ],
  },
}
