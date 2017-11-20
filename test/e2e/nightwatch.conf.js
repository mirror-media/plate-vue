require('babel-register');

module.exports = {
  'src_folders' : ['test/e2e/specs'],
  'output_folder' : 'test/e2e/reports',
  // 'custom_assertions_path': ['test/e2e/custom-assertions'],
  'page_objects_path': ['test/e2e/pages'],

  'selenium' : {
    'start_process' : true,
    // 'server_path' : 'bin/selenium-server-standalone-2.50.1.jar',
    'server_path' : require('selenium-server').path,
    // 'log_path' : '',
    'host': '127.0.0.1',
    'port' : 4444,
    'cli_args' : {
      'webdriver.chrome.driver' : require('chromedriver').path
    }
  },

  'test_settings' : {
    'default' : {
      'launch_url' : 'http://localhost:8080',
      'selenium_port'  : 4444,
      'selenium_host'  : 'localhost',
      'silent': true
    },

    'chrome' : {
      'desiredCapabilities': {
        'browserName': 'chrome',
        'javascriptEnabled': true,
        'acceptSslCerts': true
      }
    }

  }
}