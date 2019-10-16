'use strict';
class ThreeDBar extends ClassHelper {

    constructor(gl, shaderProgram, mvMatrix, config) {
        super();
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.cfg = {
            x: 0,
            y: 0,
            width: 0.2,
            height: 1,
            barColor: '#ff0000',
            barPadding: 0.1
        };
        this.mvMatrix = mvMatrix;
        this.pMatrix = mat4.create();
        this.mvMatrixStack = [];
        super.loadConfig(config);
        this.initBuffers(this.cfg.width / 2, this.cfg.height);
        this.initTexture();        
    }
    
    getBarColor() {
        return this.hexToRgb(this.cfg.barColor, 1);
    }
    
    draw() {
        this.drawScene();
    }

    initBuffers(width, height) { 
    
        let barColor = this.getBarColor();
        
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
          -width, height, -width
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.cubeVertexPositionBuffer.itemSize = 3;
        this.cubeVertexPositionBuffer.numItems = 24;
/*        
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
*/        
        this.cubeVertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
       
        let unpackedColors = [];
        for (let i = 1; i <= 24; i++) {
            unpackedColors = unpackedColors.concat(barColor);
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
    
    initTexture() {
        this.whiteTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.whiteTexture);
        let whitePixel = new Uint8Array([255, 255, 255, 255]);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, 
                      this.gl.RGBA, this.gl.UNSIGNED_BYTE, whitePixel);  
        
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);      
    }    

    drawScene() {
    
        let whiteColor = new Float32Array([1, 1, 1, 1]);
        let blackColor = new Float32Array([0, 0, 0, 1]);    
    
        mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
 
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
//        this.gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
                
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, 1, this.gl.FLOAT, false, 0, 0);
        this.gl.uniform4fv(this.shaderProgram.vColor1, blackColor);
        this.gl.uniform4fv(this.shaderProgram.vColor2, whiteColor);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.whiteTexture);        

        this.gl.uniform3f(
          this.shaderProgram.ambientColorUniform,
          parseFloat("0.2"),
          parseFloat("0.2"),
          parseFloat("0.2")
        );
        var lightingDirection = [
          parseFloat("0.0"),
          parseFloat("0.0"),
          parseFloat("-1.0")
        ];
        var adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -2);
        this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, adjustedLD);

        this.gl.uniform3f(
          this.shaderProgram.directionalColorUniform,
          parseFloat("0.8"),
          parseFloat("0.8"),
          parseFloat("0.8")
        );
            
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
        this.setMatrixUniforms();
        this.gl.drawElements(this.gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
    }

    setMatrixUniforms() {
        let normalMatrix = mat3.create();

        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

        mat4.toInverseMat3(this.mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        this.gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);       
    }
    
    hexToRgb(hex, opacity) {
       return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                       ,function(m, r, g, b) {return '#' + r + r + g + g + b + b})
                 .substring(1).match(/.{2}/g)
                 .map(function(x) {return parseInt(x, 16)/255})
                 .concat(opacity||1);
    }
}