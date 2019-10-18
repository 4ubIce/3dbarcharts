'use strict';
class MatrixStack {

    constructor() {
        this.matrixStack = [];
    }
    
    push(matrix) {
        let copy = mat4.create();
        mat4.set(matrix, copy);
        this.matrixStack.push(copy);
    }

    pop() {
        if (this.matrixStack.length == 0) {
          throw "Invalid popMatrix!";
        }
        return this.matrixStack.pop();
    }    
}