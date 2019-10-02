'use strict';
class ClassHelper {
    loadConfig(config, link) {
        if ('undefined' !== typeof config) {
            for (let i in config) {
                if ('object' == typeof config[i]) {
                    this.loadConfig(config[i], i);
                } else if ('undefined' !== typeof config[i]) {
                    if ('undefined' !== typeof link) {
                        this.cfg[link][i] = config[i];
                    } else {
                        this.cfg[i] = config[i];
                    }                    
                    
                }
            }
        }    
    }
}