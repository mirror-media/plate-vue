const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

// module.exports = Object.assign({}, base, {
module.exports = merge(base, {
  target: 'node',
  // devtool: false,
  devtool: '#source-map',
  // entry: './src/server-entry.js',
  entry: './src/entry-server.js',
  // output: Object.assign({}, base.output, {
  //   filename: 'server-bundle.js',
  //   libraryTarget: 'commonjs2'
  // }),
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    // alias: Object.assign({}, base.resolve.alias, {
    //   'create-api': './create-api-server.js'
    // })
    // alias: {
    //   'create-api': './create-api-server.js'
    // }
  },
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
  // externals: nodeExternals({
  //   // do not externalize CSS files in case we need to import it from a dep
  //   whitelist: /\.css$/
  // }),
  externals: Object.keys(require('../package.json').dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin()
  ]
})
