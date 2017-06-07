const glob = require('glob')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
// const vueConfig = require('./vue-loader.config')
// const HTMLPlugin = require('html-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')


// const config = Object.assign({}, base, {
const config = merge(base, {
  entry: {
    app: './src/entry-client.js'
  },
  resolve: {
    // alias: Object.assign({}, base.resolve.alias, {
    //   'create-api': './create-api-client.js'
    // })
    // alias: {
    //   'create-api': './create-api-client.js'
    // }
  },
  plugins: [
  // plugins: (base.plugins || []).concat([
  // strip comments in Vue code
  // new ExtractTextPlugin('styles.[hash].css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        )
      }
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new VueSSRClientPlugin()
    // generate output HTML
    // new HTMLPlugin({
    //     template: 'src/index.template.html'
    // })
  // ])
  ]
})

if (process.env.NODE_ENV === 'production') {
    // Use ExtractTextPlugin to extract CSS into a single file
    // so it's applied on initial render.
    // vueConfig is already included in the config via LoaderOptionsPlugin
    // here we overwrite the loader config for <style lang="stylus">
    // so they are extracted.
    // vueConfig.loaders = {
    //     stylus: ExtractTextPlugin.extract({
    //         loader: 'css-loader!stylus-loader',
    //         fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader
    //     })
    // }

  config.plugins.push(
    // new ExtractTextPlugin('styles.[hash].css'),
    // // this is needed in webpack 2 for minifying CSS
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.LoaderOptionsPlugin({
    //     minimize: true
    // }),
    // // minify JS
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     }
    // }),
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      // staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst'
        },
        {
          urlPattern: /\/(top|new|show|ask|jobs)/,
          handler: 'networkFirst'
        },
        {
          urlPattern: '/item/:id',
          handler: 'networkFirst'
        },
        {
          urlPattern: '/user/:id',
          handler: 'networkFirst'
        }
      ]
    })
  )
}

module.exports = config