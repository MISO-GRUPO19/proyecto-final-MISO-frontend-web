module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        jasmine: {},
        clearContext: false
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage'),
        subdir: '.',
        reporters: [
          { type: 'html' },
          { type: 'text-summary' }
        ]
      },
      reporters: ['progress', 'coverage'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      browsers: ['ChromeHeadlessCI'],
      customLaunchers: {
        ChromeHeadlessCI: {
          base: 'ChromeHeadless',
          flags: [
            '--no-sandbox',
            '--disable-gpu',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--headless',
            '--remote-debugging-port=9222'
          ]
        }
      },
      singleRun: true,
      restartOnFileChange: false
    });
  };