class ThreeDBar {

    constructor(gl, shaderProgram, mvMatrix, config) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.cfg = {
            x: 0,
            y: 0,
            width: 0.2,
            height: 1,
            offset: 0,
            barColor: '#1f77b4',
            lineColor: 'red',
            margin: {top: 50, right: 50, bottom: 50, left: 50},
            barPadding: 0.1
        };
        this.mvMatrix = mvMatrix;
        this.pMatrix = mat4.create();
        this.mvMatrixStack = [];
        this.loadConfig(config);
        this.webGLStart();
        
    }
    
    loadConfig(config) {
        if ('undefined' !== typeof config) {
            for (let i in config) {
                if ('undefined' !== typeof config[i]) {
                    this.cfg[i] = config[i];
                }
            }
        }    
    } 

    webGLStart() {
        this.initBuffers(this.cfg.width / 2, this.cfg.height);
        this.tick();
    }

    initBuffers(width, height) {

        this.cubeVertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        let vertices = [
          // Front face
          -width, -1.0,  width,
           width, -1.0,  width,
           width, height,  width,
          -width, height,  width,

          // Back face
          -width, -1.0, -width,
          -width, height, -width,
           width, height, -width,
           width, -1.0, -width,

          // Top face
          -width, height, -width,
          -width, height,  width,
           width, height,  width,
           width, height, -width,

          // Bottom face
          -width, -1.0, -width,
           width, -1.0, -width,
           width, -1.0,  width,
          -width, -1.0,  width,

          // Right face
           width, -1.0, -width,
           width, height, -width,
           width, height,  width,
           width, -1.0,  width,

          // Left face
          -width, -1.0, -width,
          -width, -1.0,  width,
          -width, height,  width,
          -width, height, -width,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.cubeVertexPositionBuffer.itemSize = 3;
        this.cubeVertexPositionBuffer.numItems = 24;
        
        this.cubeVertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        let colors = [
          [1.0, 0.0, 0.0, 1.0],     // Front face
          [1.0, 1.0, 0.0, 1.0],     // Back face
          [0.0, 1.0, 0.0, 1.0],     // Top face
          [1.0, 0.5, 0.5, 1.0],     // Bottom face
          [1.0, 0.0, 1.0, 1.0],     // Right face
          [0.0, 0.0, 1.0, 1.0],     // Left face
        ];
        let unpackedColors = [];
        for (let i in colors) {
            var color = colors[i];
            for (let j=0; j < 4; j++) {
               unpackedColors = unpackedColors.concat(color);
            }
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(unpackedColors), this.gl.STATIC_DRAW);
        this.cubeVertexColorBuffer.itemSize = 4;
        this.cubeVertexColorBuffer.numItems = 24;
        
        this.cubeVertexIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        let cubeVertexIndices = [
          0, 1, 2,      0, 2, 3,    // Front face
          4, 5, 6,      4, 6, 7,    // Back face
          8, 9, 10,     8, 10, 11,  // Top face
          12, 13, 14,   12, 14, 15, // Bottom face
          16, 17, 18,   16, 18, 19, // Right face
          20, 21, 22,   20, 22, 23  // Left face
        ]
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);
        this.cubeVertexIndexBuffer.itemSize = 1;
        this.cubeVertexIndexBuffer.numItems = 36;    
    }

    tick() {
        this.drawScene();
    }

    drawScene() {
        mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
 
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        this.setMatrixUniforms();
        this.gl.drawElements(this.gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
        
        //mvPopMatrix();
    }

    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    setMatrixUniforms() {
       this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
       this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    }

    mvPushMatrix() {
        let copy = mat4.create();
        mat4.set(this.mvMatrix, copy);
        this.mvMatrixStack.push(copy);
    }

    mvPopMatrix() {
        if (this.mvMatrixStack.length == 0) {
          throw "Invalid popMatrix!";
        }
        this.mvMatrix = this.mvMatrixStack.pop();
    } 
}