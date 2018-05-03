const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: './src/app.js',
    login: './src/login.js'
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, 'build')
  },
  devServer: {
    compress: true,
    port: 8080,
    stats: 'errors-only',
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { modules: false }]
            ]
          }
        }]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1, minimize: true } },
            'postcss-loader',
            'sass-loader'
          ]
        })
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new UglifyJsPlugin()
  ]
};
