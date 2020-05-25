'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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