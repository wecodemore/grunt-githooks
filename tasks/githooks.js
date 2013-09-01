/*
 * grunt-githooks
 * https://github.com/rhumaric/grunt-githooks
 *
 * Copyright (c) 2013 Romaric Pascal
 * Licensed under the MIT license.
 */

'use strict';

var githooks = require('../lib/githooks');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('githooks', 'Binds grunt tasks to git hooks', function() {
    
    var options = this.options({
      // Default destination for hooks is in the git directory but can be overriden to output them somewhere else
      dest: '.git/hooks'
    });

    grunt.file.mkdir(options.dest);

    for (var key in options) {

      if (key !== 'dest') {

        if (!githooks.isNameOfAGitHook(key)) {
          grunt.log.errorlns('`' + key + '` is not the name of a Git hook. Script will be created but won\'t be triggered by Git actions.');
        }

        githooks.createHook(options.dest, key, options[key]);
        grunt.log.ok('Bound `' + options[key] + '` to `' + key + '` Git hook.');
      }
    }
  });
};

// Exports the internals in case people need to override stuff
module.exports.internals = githooks;