'use strict';
class Character extends ClassHelper {

    constructor(gl, shaderProgram, mvMatrix, config) {
        super();
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.cfg = {
            x: 0,
            y: 0,
            z: 0,
            text: {
                      text: '',            
                      size: 24,
                      font: 'Georgia',
                      color: '#000000',            
                      width: 0.3,
                      height: 0.3
            },            
            rotate: 0,
            xRotation: 0,
            yRotation: 0            
        };
        this.canvas;
        this.mvMatrix = mvMatrix;
        this.pMatrix = mat4.create();
        this.mvMatrixStack = [];
        super.loadConfig(config);
        this.webGLStart();
    }
    
    getX() {
        return this.cfg.x;
    }     
 
    getY() {
        return this.cfg.y;
    }

    getZ() {
        return this.cfg.z;
    }

    getHeight() {
        return this.cfg.text.height;
    }
    
    getWidth() {
        return this.cfg.text.width;
    }
    
    getText() {
        return this.cfg.text.text;
    }
    
    getTextSize() {
        return this.cfg.text.size;
    }
    
    getTextFont() {
        return this.cfg.text.font;
    }        
    
    getTextColor() {
        return this.cfg.text.color;
    }        
    
    getRotate() {
        return this.degToRad(this.cfg.rotate);
    }
    
    getxRotation() {
        return this.cfg.xRotation;
    }
    
    getyRotation() {
        return this.cfg.yRotation;
    }           

    webGLStart() {
        this.initTextCanvas();
        this.initTexture();
        this.initBuffers();
        this.drawScene();
    }

    initTextCanvas() {
        
        let text = this.getText();
        let size = this.getTextSize();
        let font = this.getTextFont();
        this.canvas = document.createElement('canvas');
        let context = this.canvas.getContext('2d');
        
        context.font = size + 'px ' + font;
        this.canvas.width = this.getPowerOfTwo(context.measureText(text).width);
        this.canvas.height = this.getPowerOfTwo(size);
        context.font = size + 'px ' + font;
        context.fillStyle = this.getTextColor();
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, this.canvas.width/2, this.canvas.height/2);
        //context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        document.body.insertBefore(this.canvas, document.getElementById('barChart'));            
    }

    initTexture() {
        this.textTexture = this.gl.createTexture();
        this.handleLoadedTexture(this.textTexture, this.canvas);
        this.canvas.remove();
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);      
    }

    handleLoadedTexture(texture, textureCanvas) {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, textureCanvas);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    initBuffers() {
                           
        let x = this.getX();
        let y = this.getY();
        let z = this.getZ();
        let width = this.getWidth();
        let height = this.getHeight();

        this.squareVertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        let vertices = [
             x + width,  y + height,  z,
             x,          y + height,  z,
             x + width,  y,           z,
             x,          y,           z          
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.squareVertexPositionBuffer.itemSize = 3;
        this.squareVertexPositionBuffer.numItems = 4;
        
        this.squareVertexTextureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexTextureCoordBuffer);
        let textureCoords = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ];        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
        this.squareVertexTextureCoordBuffer.itemSize = 2;
        this.squareVertexTextureCoordBuffer.numItems = 4;
        
        this.squareVertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
        let colors = [0.0, 0.0, 0.0, 0.0];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.squareVertexColorBuffer.itemSize = 4;
        this.squareVertexColorBuffer.numItems = 1;
    }

    drawScene() { 
    
        let rotate = this.getRotate();
        let xRotation = this.getxRotation();
        let yRotation = this.getyRotation(); 
        let whiteColor = new Float32Array([1, 1, 1, 1]);
        let blackColor = new Float32Array([0, 0, 0, 1]);
        
        mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
        mat4.rotate(this.mvMatrix, rotate, [xRotation, yRotation, 0]);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexTextureCoordBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.squareVertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.squareVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.uniform4fv(this.shaderProgram.vColor1, whiteColor);
        this.gl.uniform4fv(this.shaderProgram.vColor2, blackColor);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textTexture);
        this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);  
        this.setMatrixUniforms();  
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
    }

    setMatrixUniforms() {
       this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
       this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    }

    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
        
    getPowerOfTwo(value, pow) {
        pow = pow || 1;
        while(pow<value) {
           pow *= 2;
        }
        return pow;
    }
}




