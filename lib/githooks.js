var fs = require('fs'),
    path = require('path'),
    handlebars = require('handlebars');

var MARKER_START = '// GRUNT-GITHOOK START',
    MARKER_END = '// GRUNT-GITHOOK END';

function createMarkerRegexp (start, end) {

  var regexp = start.replace(/\//g, '\\/') +
               '[\\s\\S]*' + // Not .* because it needs to match \n
               end.replace(/\//g, '\\/');

  return new RegExp(regexp, 'm');
} 

module.exports = {

  MARKER_REGEX: createMarkerRegexp(MARKER_START,MARKER_END),

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

    var existingCode = this.getHookContent(hookPath);

    if (existingCode) {
      this.validateScriptLanguage(existingCode, options);
    }

    var hookContent;
    if(this.MARKER_REGEX.test(existingCode)) {
      hookContent = this.insertBindingCode(task, existingCode, options);
    } else {
      hookContent = this.appendBindingCode(task, existingCode, options);
    }

    fs.writeFileSync(hookPath, hookContent);

    fs.chmodSync(hookPath, '755');
  },

  /**
   * Returns the content of the hook at given path
   * @method getHookContent
   * @param path {String} The path to the hook
   * @return {String}
   */
  getHookContent: function (path) {

    if (fs.existsSync(path)) {
      return fs.readFileSync(path, {encoding: 'utf-8'});
    }
  },

  /**
   * Validates that the language of given script matches the one
   * the binding code will be generated in
   * @method validateScriptLanguage
   * @param script {String}
   * @throws {Error} 
   */
  validateScriptLanguage: function (script, options) {

      if (!this.isValidScriptLanguage(script, options.hashbang)) {
        throw new Error('ERR_INVALID_SCRIPT_LANGUAGE');
      }
  },

  /**
   * Appends code binding the given task to given existing code
   * @method appendBindingCode
   * @param task {String}
   * @param existingCode {String}
   * @param options {Object}
   */
  appendBindingCode: function (task, existingCode, options) {

    var bindingCode = this.createBindingCode(task, options.template);
    return (existingCode || options.hashbang) +
            '\n\n' +
            bindingCode;
  },

  /**
   * Inserts binding code at the position shown by markers in the given code
   * @method insertBindingCode
   * @param task {String}
   * @param existingCode {String}
   * @param options {Object}
   */
  insertBindingCode: function (task, existingCode, options) {

    var bindingCode = this.createBindingCode(task, options.template, true);
    return existingCode.replace(this.MARKER_REGEX, bindingCode);
  },

  /**
   * Creates the code that will run the grunt task from the hook
   * @method createBindingCode
   * @param task {String}
   * @param templatePath {Object}
   */
  createBindingCode: function (task, templatePath, preventExit) {

    var template = this.loadTemplate(templatePath);
    var bindingCode = template({
      task: task,
      preventExit: preventExit
    });

    return MARKER_START + '\n' + bindingCode + '\n' + MARKER_END;
  },

  /**
   * Checks that content of given hook is written in the appropriate scripting
   * language, checking if it starts with the appropriate hashbang
   * @method isValidScriptLanguage
   * @param hookContent {String}
   * @param hashbang
   * @return {Boolean}
   */
  isValidScriptLanguage: function(hookContent, hashbang) {

    var firstLine = hookContent.split('\n')[0];
    return firstLine.indexOf(hashbang) !== -1;
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