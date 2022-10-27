module.exports = {
  defaultCommandTimeout: 30000,
  requestTimeout: 30000,
  responseTimeout: 30000,
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
