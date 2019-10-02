'use strict';
class ThreeDBarChart extends ClassHelper {

    constructor(element, config, file) {
        super();
        this.element = element;
        this.cfg = {
            x: 0,
            y: 0,
            width: 4,
            height: 1,
            depth: 1,
            ledge: 0,
            animationSpeed: -0.02,
            axisTicksCount: 4,
            text: {
                      text: '',            
                      size: 24,
                      font: 'Georgia',
                      color: '#000000',            
                      width: 0.3,
                      height: 0.3
            }            
        };
        this.gl = this.initGL(this.element);
        this.animationOn = 0;
        this.lastTime = 0;
        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, [0.0, 0.0, -10.0]);        
        this.mvMatrixStack = [];
        this.xRotation = 0;
        this.zRotation = 0;
        this.animationSpeed = this.getAnimationSpeed();
        super.loadConfig(config);
        this.init();
        this.loadDataAndDraw(file);
        this.element.onmousedown = () => {this.mouseDownEvent(event);};
        this.element.onmouseup = () => {this.mouseUpEvent();};
        //this.element.oncontextmenu = () => {return false;};
                             
    }
    
    getWidth() {
        return this.cfg.width;
    } 
    
    getHeight() {
        return this.cfg.height;
    }
    
    getDepth() {
        return this.cfg.depth;
    } 
    
    getHeight() {
        return this.cfg.height;
    }
    
    getLedge() {
        return this.cfg.ledge;
    }         
    
    getAnimationSpeed() {
        return this.cfg.animationSpeed;
    }
    
    getaxisTicksCount() {
        return this.cfg.axisTicksCount;
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
    
    getTextWidth() {
        return this.cfg.text.width;
    } 

    getTextHeight() {
        return this.cfg.text.height;
    }
    
    init() {
        this.initShaders();
    }

    loadDataAndDraw(file) {
        d3.json(file)
          .then((d) => {this.data = d;this.drawScene();});
          //.catch((error) => {console.error('can not read file: ' + file + ' ' + new Error().stack);});        
    }    
    
    tick() {
        if (this.animationOn == 1) {
            requestAnimFrame(() => {this.tick();});
            this.drawScene();
        }
    }    
    
    drawScene() {
        
        let data = this.data;
        let rowCount = data.length;
        let xLength;
        let yLength = 1;
        let zLength = 1;
        let xBarPadding;
        let zBarPadding;
        let w = this.getWidth();
        let h = this.getHeight();
        let d = this.getDepth();
        let l = this.getLedge();        
        let axisTicksCount = this.getaxisTicksCount();        
        let maxValue = d3.max(data, function(row) {return d3.max(row, function(val) {return val.Value})});
        let maxColumnCount = d3.max(data, function(row) {return row.length});
        const yScale = d3.scaleLinear()
                       .domain([0, maxValue])
                       .range([-1, h]);        

        if (this.gl) {
            mat4.rotate(this.mvMatrix, this.animationSpeed, [this.xRotation, 0, this.zRotation]);
            for (let i = 0; i < data.length; i++) {    
                for (let j = 0; j < data[i].length; j++) {
                    this.mvPushMatrix();
                    mat4.translate(this.mvMatrix, [-w / 2 + j * w / (maxColumnCount - 1), 0.0, i * d / (rowCount - 1)]);
                    const bar1 = new ThreeDBar(this.gl, this.shaderProgram, this.mvMatrix, {height: yScale(data[i][j].Value)});
                    this.mvPopMatrix();
                };
            };
            
            this.mvPushMatrix();     
            const axisX = new CoordinatePlaneText(this.gl, this.shaderProgram, this.mvMatrix, {x: -w / 2, y: 0, z: 1, width: w, height: d, xTicksCount: maxColumnCount, yTicksCount: rowCount, ledge: l, rotate: 90, xRotation: 1, text: this.cfg.text, textPosition: 'y'});
            this.mvPopMatrix();            
            this.mvPushMatrix();     
            const axisY = new CoordinatePlaneText(this.gl, this.shaderProgram, this.mvMatrix, {x: -w / 2, y: -1, z: -l, width: w, height: 1 + yScale(maxValue), xTicksCount: maxColumnCount, yTicksCount: axisTicksCount, ledge: l, text: this.cfg.text});
            this.mvPopMatrix();
            this.mvPushMatrix();     
            const axisZ = new CoordinatePlaneText(this.gl, this.shaderProgram, this.mvMatrix, {x: -d + 1, y: -1, z: w / 2 + l, width: d, height: 1 + yScale(maxValue), xTicksCount: rowCount, yTicksCount: axisTicksCount, ledge: l, rotate: -90, yRotation: 1, text: this.cfg.text, textPosition: 'y'});
            this.mvPopMatrix();            
        }                        
    }
    
    initGL(canvas) {
        let gl;
        try {
            gl = canvas.getContext("webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.enable(gl.DEPTH_TEST);
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                        
        } catch(e) {
        }
        if (!gl) {
           alert("Could not initialise WebGL, sorry :-(");
        }
        return gl;
    }

    initShaders() {
        let fragmentShader = this.getShader('shader-fs');
        let vertexShader = this.getShader('shader-vs');

        this.shaderProgram = this.gl.createProgram();
        this.gl.attachShader(this.shaderProgram, vertexShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);
        this.gl.linkProgram(this.shaderProgram);

        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
           alert("Could not initialise shaders");
        }

        this.gl.useProgram(this.shaderProgram);
        this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
        this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
        this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
        this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);        
        
        this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
        this.shaderProgram.vColor1 = this.gl.getUniformLocation(this.shaderProgram, "vColor1");
        this.shaderProgram.vColor2 = this.gl.getUniformLocation(this.shaderProgram, "vColor2");        
    } 

    getShader(id) {
        let shaderScript;
        let shader;
        if (id == 'shader-fs') {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            shaderScript = this.getFShaderScript();
        } else if (id == 'shader-vs') {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
            shaderScript = this.getVShaderScript();
        } else {
            return null;
        }

        this.gl.shaderSource(shader, shaderScript);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    } 
        
    getFShaderScript() {
        let script = `precision mediump float;
      
                      varying vec2 vTextureCoord;
                      varying vec4 vColor;
                        
                      uniform vec4 vColor1;
                      uniform vec4 vColor2;
                      uniform sampler2D uSampler;

                      void main(void) {
                          gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)) * vColor1 + vColor * vColor2;
                      }`;
        return script;    
    }
    
    getVShaderScript() {
        let script = `attribute vec3 aVertexPosition;
                      attribute vec4 aVertexColor;
                      attribute vec2 aTextureCoord;

                      uniform mat4 uMVMatrix;
                      uniform mat4 uPMatrix;
                      
                      varying vec4 vColor;
                      varying vec2 vTextureCoord;

                      void main(void) {
                          gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                          vColor = aVertexColor;
                          vTextureCoord = aTextureCoord;
                      }`;
        return script;    
    }    
    
    degToRad(degrees) {
        return degrees * Math.PI / 180;
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
    
    mouseDownEvent(e) {
        if (e.which == 1) {
            this.xRotation = 1;
        } else if (e.which == 2) {
            this.zRotation = 1;
        }
        this.animationOn = 1;
        this.tick();
    }
    
    mouseUpEvent() {
        this.xRotation = 0;
        this.yRotation = 0;
        this.zRotation = 0;
        this.animationOn = 0;
    }               
}