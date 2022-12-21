// cypress/plugins/index.js

module.exports = (on, config) => {
  if (config.testingType === 'component') {
    const { startDevServer } = require('@cypress/webpack-dev-server')

    // Vue's Webpack configuration
    const webpackConfig = require('@vue/cli-service/webpack.config.js')

    on('dev-server:start', (options) =>
      startDevServer({ options, webpackConfig })
    )
  }

  return config
}