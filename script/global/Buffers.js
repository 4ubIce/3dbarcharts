'use strict';
define('Buffers', function() {

    function Buffers(gl, sp) {
        this.gl = gl;
        this.shaderProgram = sp;
        this.cubeVertexNormalBuffer;
    }

    Buffers.prototype = {

        constructor: Buffers,

        init: function () {
            this.cubeVertexNormalBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
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
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexNormals), this.gl.STATIC_DRAW);
            this.cubeVertexNormalBuffer.itemSize = 3;
            this.cubeVertexNormalBuffer.numItems = 24;
            this.gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        }
    }
    
    return Buffers;
});