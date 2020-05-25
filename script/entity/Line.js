class Line {

    constructor(gl, shaderProgram, mvMatrix, config) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.cfg = {
            x1: 0,
            y1: 0,
            z1: 0,
            x2: 1,
            y2: 0,
            z2: 0,            
            width: 0.2,
            height: 1,
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
    
    getX1() {
        return this.cfg.x1;
    }     
 
    getY1() {
        return this.cfg.y1;
    }

    getZ1() {
        return this.cfg.z1;
    }

    getX2() {
        return this.cfg.x2;
    }
    
    getY2() {
        return this.cfg.y2;
    }
    
    getZ2() {
        return this.cfg.z2;
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
                             
        let x1 = this.getX1();
        let y1 = this.getY1();
        let z1 = this.getZ1();
        let x2 = this.getX2();
        let y2 = this.getY2();
        let z2 = this.getZ2();
    
    
        this.cubeVertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
        let vertices = [
            x1, y1, z1,
            x2, y2, z2
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.cubeVertexPositionBuffer.itemSize = 3;
        this.cubeVertexPositionBuffer.numItems = 2;
        
        this.cubeVertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
        let colors = [
          [0.0, 0.0, 0.0, 1.0]
        ];
        let unpackedColors = [];
        for (let i in colors) {
            let color = colors[i];
            for (let j=0; j < 4; j++) {
               unpackedColors = unpackedColors.concat(color);
            }
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(unpackedColors), this.gl.STATIC_DRAW);
        this.cubeVertexColorBuffer.itemSize = 1;
        this.cubeVertexColorBuffer.numItems = 1;
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
        this.setMatrixUniforms();
        this.gl.drawArrays(this.gl.LINES, 0, this.cubeVertexPositionBuffer.numItems);
    }

    setMatrixUniforms() {
       this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
       this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    }
}