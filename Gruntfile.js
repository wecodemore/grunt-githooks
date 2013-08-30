/*
 * grunt-githooks
 * https://github.com/rhumaric/grunt-githooks
 *
 * Copyright (c) 2013 Romaric Pascal
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'lib/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    githooks: {

      // Actual target used to bind hooks for project development
      'dev': {
        options: {
          'pre-commit': 'jshint'
        }
      },

      // Test targets
      'test.default': {
        options: {
          dest: 'tmp/default',
          'pre-commit': 'aTask'
        }
      },
      'test.multiple_tasks': {
        options: {
          dest: 'tmp/multiple_tasks',
          'pre-commit': 'aTask anotherTask'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'githooks', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

  // Dummy tasks used for testing
  grunt.registerTask('aTask', function () {});
  grunt.registerTask('anotherTask', function () {});
};
