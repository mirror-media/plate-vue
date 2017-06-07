const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  // entry: {
  //   app: './src/client-entry.js',
    // vendor: [
    //   'es6-promise',
    //   'vue',
    //   'vue-router',
    //   'vuex',
    //   'vuex-router-sync'
    // ]
  // },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../public')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      // {
      //   test: /\.css$/,
      //   loader: 'style-loader!css-loader'
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
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
        use: isProd
          ? ExtractTextPlugin.extract({
              use: 'css-loader?minimize',
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader']
      },
      // {
      //   test: /\.js$/,
      //   loader: 'buble-loader',
      //   exclude: /node_modules/,
      //   options: {
      //     objectAssign: 'Object.assign'
      //   }
      // },
    ]
  },
  // externals: [
  //   'canvas'
  // ],
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
    // hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  // plugins: [
  //   // new ExtractTextPlugin('styles.[hash].css'),
  // ]
  plugins: isProd
    ? [
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        }),
        new ExtractTextPlugin({
          filename: 'common.[chunkhash].css'
        })
      ]
    : [
        new FriendlyErrorsPlugin()
      ]
}