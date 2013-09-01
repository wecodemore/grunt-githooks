/*
 * grunt-githooks
 * https://github.com/rhumaric/grunt-githooks
 *
 * Copyright (c) 2013 Romaric Pascal
 * Licensed under the MIT license.
 */

'use strict';

var githooks = require('../lib/githooks'),
    path = require('path');

var defaults = {
  // Default destination for hooks is in the git directory but can be overriden to output them somewhere else
  dest: '.git/hooks',
  template: path.resolve(__dirname, '../templates/node.js.hb')
};

function isGitHookDefinition(key) {
  // Consider any key that does not have a default as a GitHookDefinition
  return (typeof defaults[key]) === 'undefined';
}

var task = module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('githooks', 'Binds grunt tasks to git hooks', function() {
    
    var options = this.options(defaults);

    grunt.file.mkdir(options.dest);

    for (var key in options) {

      if (isGitHookDefinition(key)) {

        task.createHook(key, options, grunt);
      }
    }
  });
};

task.createHook = function (hookName, options, grunt) {

  grunt.log.subhead('Binding `' + options[hookName] + '` to `' + hookName + '` Git hook.');

  task.validateHookName(hookName, grunt);

  try {
    task.internals.createHook(hookName, options[hookName], options);
    grunt.log.ok();
  } catch (error) {
    task.logError(error, hookName, grunt);
  }
};

task.validateHookName = function (hookName, grunt) {

  if (!task.internals.isNameOfAGitHook(hookName)) {
    grunt.log.errorlns('`' + hookName + '` is not the name of a Git hook. Script will be created but won\'t be triggered by Git actions.');
  }
};

task.logError = function (error, hookName, grunt) {
  var gruntError = error;
  if(error.message && error.message === 'ERR_INVALID_SCRIPT_LANGUAGE'){
    gruntError = 'A hook already exist for `' + hookName + '` but doesn\'t seem to be written in the same language as the binding script.';
  }
  grunt.fail.warn(gruntError);
};

task.defaults = defaults;
task.internals = githooks;