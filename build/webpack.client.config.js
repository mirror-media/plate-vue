const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const config = merge(base, {
  entry: {
    app: './src/entry-client.js'
  },
  optimization: {
    providedExports: true,
    usedExports: true,
    sideEffects: true,
    concatenateModules: true,
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    runtimeChunk: {
      name: 'manifest'
    },
    // extract vendor chunks for better caching
    splitChunks: {
      chunks: 'all',
      minSize: 10000,
      // maxSize: 1500000,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test (module) {
            // a module is extracted into the vendor chunk if...
            return (
              // it's inside node_modules
              /node_modules/.test(module.context) &&
              // and not a CSS file
              !/\.css$/.test(module.request)
            )
          },
          chunks: 'all',
          minChunks: 2,
          maxInitialRequests: 5
          // minSize: 0,
        }
      }
    }
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
  ]
})

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // auto generate service worker
    new SWPrecacheWebpackPlugin({
      cacheId: 'mirror-media',
      filename: 'service-worker.js',
      minify: true,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: /(localhost:8080|mirrormedia.mg)\/(app|author|category|external|project-list|story|section|tag|topic|video)\/[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|[\]/\\]+$/,
          handler: 'networkFirst'
        },
        {
          urlPattern: /(localhost:8080|mirrormedia.com.tw|mirrormedia.mg|storage.googleapis.com\/mirrormedia-files)\/assets\/(?!audios\/)[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|[\]/\\]+.[\s\S]+$/,
          handler: 'networkFirst'
        },
        {
          urlPattern: /(localhost:8080|mirrormedia.mg)\/?$/,
          handler: 'networkFirst'
        },
        {
          urlPattern: /(localhost:8080|mirrormedia.mg)\/dist\/[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|[\]/\\]+.[\s\S]+$/,
          handler: 'networkFirst'
        },
        {
          urlPattern: /(localhost:8080|mirrormedia.mg)\/api\/(?!tracking)[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|[\]/\\]+$/,
          handler: 'networkFirst'
        }
      ]
    })
  )
}

module.exports = config
