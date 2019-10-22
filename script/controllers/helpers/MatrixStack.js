'use strict';
define('MatrixStack', function() {

    function MatrixStack() {
        this.matrixStack = [];
    }

    MatrixStack.prototype = {

        constructor: MatrixStack,
        
        push: function (matrix) {
            let copy = mat4.create();
            mat4.set(matrix, copy);
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