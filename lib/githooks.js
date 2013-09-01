var fs = require('fs'),
    path = require('path'),
    handlebars = require('handlebars');


module.exports = {

  /**
   * List of the Git hook names
   * @property HOOK_NAMES
   * @type {Array}
   */
  HOOK_NAMES: [
    // CLIENT HOOKS
    'applypatch-msg',
    'pre-applypatch',
    'post-applypatch',
    'pre-commit',
    'prepare-commit-msg',
    'commit-msg',
    'post-commit',
    'pre-rebase',
    'post-checkout',
    'post-merge',
    'post-rewrite',

    // SERVER HOOKS
    'pre-receive',
    'update',
    'post-receive',
    'post-update',
    'pre-auto-gc'
  ],

  // MODULE API
  /**
   * Create a hook with given hookName in given directory 
   * which will run the provided task
   * @method createHook
   * @param directory {String}
   * @param hookName {String}
   * @param task {String}
   */
  createHook: function (hookName, task, options) {

    var hookPath = path.resolve(options.dest, hookName);

    var existingContent = this.getHookContent(hookPath);
    if (existingContent) {
      if (!this.isValidScriptLanguage(existingContent)) {
        throw new Error('ERR_INVALID_SCRIPT_LANGUAGE');
      }
    }

    var template = this.loadTemplate(options.template);
    var hookContent = template({
      task: task
    });

    hookContent = (existingContent || '#!/usr/bin/env node') +
                  '\n\n' +
                  hookContent;

    fs.writeFileSync(hookPath, hookContent);

    fs.chmodSync(hookPath, '755');
  },

  /**
   * Returns the content of the hook at given path
   * @method getHookContent
   * @param path {String} The path to the hook
   * @return {String}
   */
  getHookContent: function(path) {

    if (fs.existsSync(path)) {
      return fs.readFileSync(path, {encoding: 'utf-8'});
    }
  },

  /**
   * Checks that content of given hook is written in the appropriate scripting
   * language
   * @method isValidScriptLanguage
   * @param hookContent {String}
   * @return {Boolean}
   */
  isValidScriptLanguage: function(hookContent) {

    // Simple 'shebang' comparison
    var firstLine = hookContent.split('\n')[0];
    return firstLine.indexOf('#!/usr/bin/env node') !== -1;
  },

  /**
   * Checks that given name is the name of a Git hook (see HOOK_NAMES for the list of Git hook names)
   * @method isNameOfAGitHook
   * @param name {String}
   * @return {Boolean}
   */
  isNameOfAGitHook: function(name) {
    return this.HOOK_NAMES.indexOf(name) !== -1;
  },

  /**
   * Loads template at given path
   * @method loadTemplate
   * @param templatePath {String}
   * @return {Function}
   */
  loadTemplate: function (templatePath) {

    var template = fs.readFileSync(templatePath, {
      encoding: 'utf-8'
    });

    return handlebars.compile(template);
  }
};