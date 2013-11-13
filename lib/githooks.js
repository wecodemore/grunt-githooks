var fs = require('fs'),
    path = require('path'),
    handlebars = require('handlebars'),
    escapeBackslashes = require('./escapeBackslashes.handlebars');

handlebars.registerHelper('escapeBackslashes', escapeBackslashes);

/**
 * Class to help manage a hook
 * @class Hook
 * @module githooks
 * @constructor
 */
function Hook(hookName, taskNames, options) {

  /**
   * The name of the hook
   * @property hookName
   * @type {String}
   */
  this.hookName = hookName;

  /**
   * The name of the tasks that should be run by the hook, space separated
   * @property taskNames
   * @type {String}
   */
  this.taskNames = taskNames;

  /**
   * Options for the creation of the hook
   * @property options
   * @type {Object}
   */
  this.options = options || {};

  this.markerRegExp = new RegExp(this.options.startMarker.replace(/\//g, '\\/') +
                      '[\\s\\S]*' + // Not .* because it needs to match \n
                      this.options.endMarker.replace(/\//g, '\\/'), 'm');
}

Hook.prototype = {

  /**
   * Creates the hook
   * @method create
   */
  create: function() {

    var hookPath = path.resolve(this.options.dest, this.hookName);

    var existingCode = this.getHookContent(hookPath);

    if (existingCode) {
      this.validateScriptLanguage(existingCode);
    }

    var hookContent;
    if(this.hasMarkers(existingCode)) {
      hookContent = this.insertBindingCode(existingCode);
    } else {
      hookContent = this.appendBindingCode(existingCode);
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
  validateScriptLanguage: function (script) {

      if (!this.isValidScriptLanguage(script, this.options.hashbang)) {
        throw new Error('ERR_INVALID_SCRIPT_LANGUAGE');
      }
  },

  /**
   * Checks that content of given hook is written in the appropriate scripting
   * language, checking if it starts with the appropriate hashbang
   * @method isValidScriptLanguage
   * @param hookContent {String}
   * @param hashbang {String}
   * @return {Boolean}
   */
  isValidScriptLanguage: function(hookContent, hashbang) {

    var firstLine = hookContent.split('\n')[0];
    return firstLine.indexOf(hashbang) !== -1;
  },

  /**
   * Checks if given code has marker for inserting the binding code
   * @method hasMarkers
   * @param existingCode {String}
   * @return {Boolean}
   */
  hasMarkers: function(existingCode) {

    return this.markerRegExp.test(existingCode);
  },

  /**
   * Creates the code that will run the grunt task from the hook
   * @method createBindingCode
   * @param task {String}
   * @param templatePath {Object}
   */
  createBindingCode: function () {

    var template = this.loadTemplate(this.options.template);
    var bindingCode = template({
      command: this.options.command,
      task: this.taskNames,
      preventExit: this.options.preventExit,
      args: this.options.args,
      gruntfileDirectory: process.cwd(),
      options: this.options
    });

    return this.options.startMarker + '\n' + bindingCode + '\n' + this.options.endMarker;
  },

  /**
   * Loads template at given path
   * @method loadTemplate
   * @param templatePath {String}
   * @return {Function}
   */
  loadTemplate: function () {

    var template = fs.readFileSync(this.options.template, {
      encoding: 'utf-8'
    });

    return handlebars.compile(template);
  },

  /**
   * Appends code binding the given task to given existing code
   * @method appendBindingCode
   * @param existingCode {String}
   * @return {String}
   */
  appendBindingCode: function (existingCode) {

    var bindingCode = this.createBindingCode();
    return (existingCode || this.options.hashbang) +
            '\n\n' +
            bindingCode;
  },

  /**
   * Inserts binding code at the position shown by markers in the given code
   * @method insertBindingCode
   * @param existingCode {String}
   * @return {String}
   */
  insertBindingCode: function (existingCode) {

    var bindingCode = this.createBindingCode();
    return existingCode.replace(this.markerRegExp, bindingCode);
  },
};

/**
 * The name of the hooks offered by Git
 * @property HOOK_NAMES
 * @type {Array}
 * @static
 */
Hook.HOOK_NAMES = [
  // CLIENT HOOKS
  'applypatch-msg',
  'pre-applypatch',
  'post-applypatch',
  'pre-commit',
  'prepare-commit-msg',
  'commit-msg',
  'post-commit',
  'pre-rebase',
  'pre-push',
  'post-checkout',
  'post-merge',
  'post-rewrite',

  // SERVER HOOKS
  'pre-receive',
  'update',
  'post-receive',
  'post-update',
  'pre-auto-gc'
];
/**
 * Checks that given name is the name of a Git hook (see HOOK_NAMES for the list of Git hook names)
 * @method isNameOfAGitHook
 * @param name {String}
 * @return {Boolean}
 * @static
 */
Hook.isNameOfAGitHook = function(name) {
  return Hook.HOOK_NAMES.indexOf(name) !== -1;
};

module.exports.Hook = Hook;
