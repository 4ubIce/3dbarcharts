class Character {

    constructor(gl, shaderProgram, mvMatrix, config) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.cfg = {
            x: 0,
            y: 0,
            z: 0,
            height: 1,
            width: 1,
            xLinePadding: 0.5,
            yLinePadding: 0.5,
            ledge: 0.0,
            rotate: 0,
            xRotation: 0,
            yRotation: 0,            
            barColor: '#1f77b4',
            lineColor: 'red',
            margin: {top: 50, right: 50, bottom: 50, left: 50},
        };
        this.canvas;
        this.mvMatrix = mvMatrix;
        this.pMatrix = mat4.create();
        this.mvMatrixStack = [];
        this.loadConfig(config);
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
        return this.cfg.height;
    }
    
    getWidth() {
        return this.cfg.width;
    }
    
    getxLinePadding() {
        return this.cfg.xLinePadding;
    }
    
    getyLinePadding() {
        return this.cfg.yLinePadding;
    }   
     
    getyLedge() {
        return this.cfg.ledge;
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
        this.initTextCanvas();
        this.initTexture();
        this.initBuffers();
        this.drawScene();
    }

    initTextCanvas() {
        
        let text = 'x1';
        let padding = 12;
        let size = 24;
        this.canvas = document.createElement('canvas');
        let context = this.canvas.getContext('2d');
        
        context.font = size + "px Georgia";
/*        let textWidth = context.measureText(text).width;
        this.canvas.width = textWidth + padding;
        this.canvas.height = size + padding;
*/        
        this.canvas.width = getPowerOfTwo(context.measureText(text).width);
        this.canvas.height = getPowerOfTwo(size);        
        context.font = size + "px Georgia";
        context.fillStyle = "#1f77b4";
        context.fillText(text, 1, 30);
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
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
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
/*        let textureCoords = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
*/
        let textureCoords = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
            
            
        ];        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
        this.squareVertexTextureCoordBuffer.itemSize = 2;
        this.squareVertexTextureCoordBuffer.numItems = 4;
        
        this.cubeVertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        let colors = [0.0, 0.0, 0.0, 0.0];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.cubeVertexColorBuffer.itemSize = 4;
        this.cubeVertexColorBuffer.numItems = 1;        
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
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
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
    
    div(val, by){
        return Math.trunc(val / by);
    }

    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }    
}

function getPowerOfTwo(value, pow) {
    pow = pow || 1;
    while(pow<value) {
       pow *= 2;
    }
    return pow;
}


