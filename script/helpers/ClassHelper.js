'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

define('ClassHelper', function () {
  function ClassHelper() {}

  ClassHelper.prototype = {
    constructor: ClassHelper,
    loadConfig: function loadConfig(cfg, config) {
      if ('undefined' !== typeof config) {
        for (var i in config) {
          if ('object' === _typeof(config[i]) && !Array.isArray(config[i])) {
            this.loadConfig(cfg[i], config[i]);
          } else if ('undefined' !== typeof config[i]) {
            cfg[i] = config[i];
          }
        }
      }
    }
  };
  return ClassHelper;
});