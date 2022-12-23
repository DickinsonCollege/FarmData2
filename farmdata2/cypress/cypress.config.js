module.exports = {
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  video: false,
  screenshotOnRunFailure: false,
  chromeWebSecurity: false,
  
  component: {
    setupNodeEvents(on, config) {},
    specPattern: '**/*.spec.comp.js',
    devServer: {
      framework: 'vue-cli',
      bundler: 'webpack',
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://fd2_farmdata2',
    specPattern: '**/*.spec.js',
  },
};
