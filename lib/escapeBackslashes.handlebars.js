'use strict';

module.exports = function (object) {

  return object.toString().replace(/\\/g,'\\\\').replace(/'/g,'\\\'');
};
