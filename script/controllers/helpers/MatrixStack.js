'use strict';
define('MatrixStack', function() {

    function MatrixStack() {
        this.matrixStack = [];
    }

    MatrixStack.prototype = {

        constructor: MatrixStack,
        
        push: function (matrix) {

            let copy;

            if (typeof mat4 !== 'undefined') {
                copy = mat4.create();
                mat4.set(matrix, copy);            
            } else {
                let glMatrix = require('gl-Matrix');
                copy = glMatrix.mat4.create();
                glMatrix.mat4.set(matrix, copy);            
            };
            this.matrixStack.push(copy);
        },

        pop: function () {
            if (this.matrixStack.length == 0) {
              throw "Invalid popMatrix!";
            }
            return this.matrixStack.pop();
        }    
    }

    return MatrixStack;
});