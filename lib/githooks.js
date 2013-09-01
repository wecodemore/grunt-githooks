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
  createHook: function (directory, hookName, task) {

    var hookPath = path.resolve(directory, hookName);
    var template = this._loadTemplate();
    var hookContent = template({
      task: task
    });

    fs.writeFileSync(hookPath, hookContent, {
      mode: 493 // 755
    });
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

  // HELPERS
  _loadTemplate: function (file) {

    var template = fs.readFileSync('templates/node.js.hb', {
      encoding: 'utf-8'
    });

    return handlebars.compile(template);
  }
};