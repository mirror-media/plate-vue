const baseConfig = require('../../build/webpack.client.config')
const webpack = require('webpack')
const webpackConfig = Object.assign({}, baseConfig, {
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"test"'
    })
  ]
})

delete webpackConfig.entry
module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    reporters: ['spec', 'coverage'],
    files: [
      './index.js',
      '../../node_modules/es6-promise/dist/es6-promise.auto.js',
    ],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap', 'coverage']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    // port: 9876,
    // listenAddress: 'localhost',
    // hostname: 'localhost',
    autoWatch: true,
  })
}
