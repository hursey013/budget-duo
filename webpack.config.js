const glob = require('glob-all');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src', 'stylesheets')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('tailwindcss')('./tailwind.js'),
                  require('autoprefixer')(),
                ],
              },
            },
            'sass-loader',
          ],
        }),
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
              outputPath: './images/'
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      'chart.js': 'chart.js/dist/Chart.js',
    },
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin({
      filename: 'style.[hash].css'
    }),
    new PurgecssPlugin({
      paths: glob.sync([
        './src/index.html',
        './src/templates/*.handlebars',
      ]),
      extractors: [
        {
          extractor: class {
            static extract(content) {
              return content.match(/[A-z0-9-:\/]+/g)
            }
          },
          extensions: ['handlebars', 'html']
        }
      ],
      fontFace: true,
      keyframes: true,
      whitelist: ['animated', 'expanded', 'fadeIn', 'hidden', 'shake'],
      whitelistPatterns: [/^firebaseui-/, /^mdl-/, /^split-/]
    }),
    new HtmlWebpackPlugin({
      favicon: './src/images/favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
      },
      template: './src/index.html',
    }),
    new CompressionPlugin(),
  ],
};
