'use strict';
define('ClassHelper', function() {

    function ClassHelper() {

    }

    ClassHelper.prototype = { 
    
        constructor: ClassHelper,
        
        loadConfig: function (cfg, config) {
            if ('undefined' !== typeof config) {
                for (let i in config) {
                    if (('object' === typeof config[i]) && (!Array.isArray(config[i]))) {
                        this.loadConfig(cfg[i], config[i]);
                    } else if ('undefined' !== typeof config[i]) {
                          cfg[i] = config[i];
                    }
                }
            }    
        }
    }

    return ClassHelper;
});