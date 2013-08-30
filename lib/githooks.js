var fs = require('fs'),
    path = require('path'),
    handlebars = require('handlebars');


module.exports = {

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

  // HELPERS
  _loadTemplate: function (file) {

    var template = fs.readFileSync('templates/node.js.hb', {
      encoding: 'utf-8'
    });

    return handlebars.compile(template);
  }
};