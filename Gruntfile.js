module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-es3-safe-recast');
  require('load-grunt-tasks')(grunt);
  var config = require('load-grunt-config')(grunt, {
    configPath: 'tasks/options',
    init: false
  });

  grunt.loadTasks('tasks');

  this.registerTask('default', ['build']);

  // Run a server. This is ideal for running the QUnit tests in the browser.
  this.registerTask('server', [
    'build',
    'tests',
    'connect',
    'watch:server'
  ]);


  // Build test files
  this.registerTask('tests', 'Builds the test package', [
    'transpile:testsAmd',
    'concat:amdTests' // yet another hack to get es6 transpiled tests
  ]);

  // Build a new version of the library
  this.registerTask('build', 'Builds a distributable version of <%= cfg.name %>', [
    'clean:build',
    'transpile:amd',
    'concat:forTests',
    'jshint:lib'
  ]);

  // Custom phantomjs test task
  this.registerTask('test:phantom', "Runs tests through the command line using PhantomJS", [
    'build',
    'tests'
  ]);

  this.registerTask('test', [
    'build',
    'tests',
    'testem:ci:basic'
  ]);

  this.registerTask('build-release', [
    'clean:release',
    'build',
    'concat:amd',
    'concat:amdNoVersion',
    'uglify:withVersion',
    'uglify:noVersion',
    'usebanner:addVersion',
    'copy:appAddOn',
    'copy:vendorAddOn',
    'es3_safe_recast'
  ]);

  // Custom YUIDoc task
  this.registerTask('docs', ['yuidoc']);

  config.env = process.env;
  config.pkg = grunt.file.readJSON('package.json');

  config.es3_safe_recast = { default_options: {
    options: {},
    files: [
      {
        src: [
          'vendor-addon/torii/torii.amd.js'
        ],
        dest: 'vendor-addon/torii/torii.amd.js'
      }
    ]
  }};

  // Load custom tasks from NPM
  grunt.loadNpmTasks('grunt-contrib-yuidoc');

  // Merge config into emberConfig, overwriting existing settings
  grunt.initConfig(config);
};
