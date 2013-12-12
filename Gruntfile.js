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

    copy: {
      tests: {
        files: [
          {cwd: 'test/fixtures', src: '**', dest: 'tmp', expand: true}
        ]
      }
    },

    // Configuration to be run (and then tested).
    githooks: {

      // Actual target used to bind hooks for project development
      'dev': {
        'pre-commit': 'jshint'
      },

      // Test targets
      // Default hook creation
      'test.default': {
        options: {
          dest: 'tmp/default',
        },
        'pre-commit': 'aTask'
      },

      // Binding multiple tasks
      'test.multiple_tasks': {
        options: {
          dest: 'tmp/multiple_tasks',
        },
        'pre-commit': 'aTask anotherTask'
      },

      'test.multipleHooks': {

        options: {
          dest: 'tmp/multipleHooks'
        },
        'pre-commit': 'aTask',
        'commit-msg': 'anotherTask'
      },

      // Appending binding to and existing hook 
      'test.append': {
        options: {
          dest: 'tmp/append'
        },
        'pre-commit': 'aTask'
      },

      'test.customTemplate': {
        options: {
          dest: 'tmp/customTemplate',
          template: 'test/fixtures/custom-template.js.hb'
        },
        'pre-commit': 'aTask'
      },

      'test.insert': {
        options: {
          dest: 'tmp/insert',
          preventExit: true
        },
        'pre-commit': 'aTask'
      },

      'test.customHashbang': {
        options: {
          dest: 'tmp/customHashbang',
          hashbang: '#!/usr/bin/node'
        },
        'pre-commit': 'aTask'
      },

      'test.withArguments': {
        options: {
          dest: 'tmp/withArguments',
					args: "--test myargument"
        },
        'pre-commit': 'aTask'
      },

      'test.withQuotedArguments': {
        options: {
          dest: 'tmp/withQuotedArguments',
          args: '--test "foo \'bar baz\'"'
        },
        'pre-commit': 'aTask'
      },

      'test.hookSpecificOptions': {

        options: {
          dest: 'tmp/hookSpecificOptions',
          hashbang: '#!/usr/bin/node'
        },
        'pre-commit': {
          taskNames: 'aTask',
          template: 'test/fixtures/custom-template.js.hb'
        }
      },

      'test.shellScript': {

        options: {
          dest: 'tmp/shellScript',
          hashbang: '#!/bin/sh',
          template: 'templates/shell.hb',
          startMarker: '## GRUNT-GITHOOKS START',
          endMarker: '## GRUNT-GITHOOKS END'
        },
        'pre-commit':'jshint'
      },

      'test.command': {
        options: {
          dest: 'tmp/command'
        },
        'pre-commit': {
          command: '/usr/bin/grunt',
          taskNames: 'aTask'
        }
      },

      'test.noTaskNames': {
        options: {
          dest: 'tmp/noTaskNames'
        },
        'pre-commit': {
          preventExit: true
        }
      },

      // Test targets for logging validation
      // Logs which tasks get bound to which hook
      'logs.defaultLogging': {
        options: {
          dest: 'tmp/defaultLogging',
        },
        'pre-commit': 'aTask'
      },

      // Logs if the hook name does not correspond to a Git hook
      'logs.warnIfNotValidHook': {
        options: {
          dest: 'tmp/warnIfNotValidHook',
        },
        'definitelyNotTheNameOfAGitHook': 'jshint'
      },

      // Fail if the existing hook does not have the appropriate scripting
      // language
      'fails.invalidScriptingLanguage': {
        options: {
          dest: 'tmp/invalidScriptingLanguage',
        },
        'pre-commit': 'jshint'
      },

      'fails.customHashbangInvalidScriptingLanguage': {
        options: {
          dest: 'tmp/customHashbangInvalidScriptingLanguage',
          hashbang: '#!/usr/bin/node'
        },
        'pre-commit': 'jshint'
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's test task(s), then test the result.
  grunt.registerTask('test', (function () {
    
    var tasks = [
      'clean', 
      'copy'
    ];

    for (var target in grunt.config.data.githooks) {
      if(/^test\./.test(target)){
        tasks.push('githooks:'+target);
      }
    }
  
    tasks.push('nodeunit');

    return tasks;
  }()));

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

  // Dummy tasks used for testing
  grunt.registerTask('aTask', function () {
    console.log('Boom! Running a task!');
  });
  grunt.registerTask('anotherTask', function () {});
};
