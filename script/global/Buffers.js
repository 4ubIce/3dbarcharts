'use strict';
class Buffers {

    constructor(gl, sp) {
        this.cubeVertexNormalBuffer;
        this.init(gl, sp);
    }

    init(gl, shaderProgram) {
        this.cubeVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
        var vertexNormals = [
          // Front face
           0.0,  0.0,  1.0,
           0.0,  0.0,  1.0,
           0.0,  0.0,  1.0,
           0.0,  0.0,  1.0,

          // Back face
           0.0,  0.0, -1.0,
           0.0,  0.0, -1.0,
           0.0,  0.0, -1.0,
           0.0,  0.0, -1.0,

          // Top face
           0.0,  1.0,  0.0,
           0.0,  1.0,  0.0,
           0.0,  1.0,  0.0,
           0.0,  1.0,  0.0,

          // Bottom face
           0.0, -1.0,  0.0,
           0.0, -1.0,  0.0,
           0.0, -1.0,  0.0,
           0.0, -1.0,  0.0,

          // Right face
           1.0,  0.0,  0.0,
           1.0,  0.0,  0.0,
           1.0,  0.0,  0.0,
           1.0,  0.0,  0.0,

          // Left face
          -1.0,  0.0,  0.0,
          -1.0,  0.0,  0.0,
          -1.0,  0.0,  0.0,
          -1.0,  0.0,  0.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
        this.cubeVertexNormalBuffer.itemSize = 3;
        this.cubeVertexNormalBuffer.numItems = 24; 
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);        
    }
}