class CoordinatePlane {

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
        this.initBuffers();
        this.drawScene();
    }

    initBuffers() {
                           
        let x = this.getX();
        let y = this.getY();
        let z = this.getZ();
        let width = this.getWidth();
        let height = this.getHeight();
        let xLinePadding = this.getxLinePadding();
        let yLinePadding = this.getyLinePadding();
        let ledge = this.getyLedge();
        let xlineCount = this.div(width, xLinePadding) + 1;
        let ylineCount = this.div(height, yLinePadding) + 1;
/*        
        x
        [0,    0,    0,    |  width,  0,      0]
        [0,    0,    0.2,  |  width,  0,      0.2]
        [0,    0,    0.4,  |  width,  0,      0.4]
        
        y
        [0,    0,    0,    |  0,      width,  0]
        [0.2,  0,    0,    |  0.2,    width,  0]
        [0.4,  0,    0,    |  0.4,    width,  0]
        
        z
        [0,    0,    0,    |  0,      0,      width]
        [0,    0.2,  0,    |  0,      0.2,    width]
        [0,    0.4,  0,    |  0,      0.4,    width]       
*/             
  
        this.cubeVertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        let vertices = [];
        for (let i = 0; i < ylineCount; i++) {
           vertices = vertices.concat([x - ledge,         y + i * yLinePadding, z,
                                       x + width + ledge, y + i * yLinePadding, z]);
        }
        
        for (let i = 0; i < xlineCount; i++) {
           vertices = vertices.concat([x + i * xLinePadding, y - ledge,          z,
                                       x + i * xLinePadding, y + height + ledge, z]);                                       
        }        
      
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.cubeVertexPositionBuffer.itemSize = 3;
        this.cubeVertexPositionBuffer.numItems = 2 * (xlineCount + ylineCount);

        this.cubeVertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        let colors = [
          [0.0, 0.0, 0.0, 1.0]
        ];
        let unpackedColors = [];
        for (let i in colors) {
            let color = colors[i];
            for (let j = 0; j < 4; j++) {
               unpackedColors = unpackedColors.concat(color);
            }
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(unpackedColors), this.gl.STATIC_DRAW);
        this.cubeVertexColorBuffer.itemSize = 1;
        this.cubeVertexColorBuffer.numItems = 1;
    }

    drawScene() { 
    
        let rotate = this.getRotate();
        let xRotation = this.getxRotation();
        let yRotation = this.getyRotation(); 
        
        mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
        mat4.rotate(this.mvMatrix, rotate, [xRotation, yRotation, 0]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.setMatrixUniforms();
        this.gl.drawArrays(this.gl.LINES, 0, this.cubeVertexPositionBuffer.numItems);
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


