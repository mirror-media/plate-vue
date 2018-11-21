const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { PUBLIC_PATH } = require('../api/config')
const { VueLoaderPlugin } = require('vue-loader')

const NODE_ENV = process.env.NODE_ENV || 'development'
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: NODE_ENV,
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: PUBLIC_PATH || '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'assets': path.resolve(__dirname, '../assets'),
      'src': path.resolve(__dirname, '../src'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { minimize: isProd }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { minimize: isProd }
          },
          'postcss-loader',
          'stylus-loader'
        ]
        // use: isProd
        //   ? ExtractTextPlugin.extract({
        //       use: [
        //         {
        //           loader: 'css-loader',
        //           options: { minimize: true }
        //         },
        //         'postcss-loader',
        //         'stylus-loader'
        //       ],
        //       fallback: 'vue-style-loader'
        //     })
        //   : [ 'vue-style-loader', 'css-loader', 'postcss-loader', 'stylus-loader' ]
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
          filename: 'common.[chunkhash].css'
        })
      ]
    : [
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin()
      ]
}