class ThreeDBarChart {

    constructor(element, config, file) {
        this.element = element;
        this.cfg = {
            x: 0,
            y: 0,
            width: 600,
            height: 500,
            offset: 0,
            barColor: '#1f77b4',
            lineColor: 'red',
            margin: {top: 50, right: 50, bottom: 50, left: 50},
            barPadding: 0.1
        };
        this.gl = this.initGL(this.element);
        this.rCube = 0;
        this.lastTime = 0;
        this.mvMatrix = mat4.create();
        this.mvMatrixStack = [];            
        this.loadConfig(config);
        this.init();
        this.loadDataAndDraw(file);
        
    }
    
    getWidth() {
        return this.cfg.width;
    } 
    
    getHeight() {
        return this.cfg.height;
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
    
    init() {
        this.initShaders();
    }

    loadDataAndDraw(file) {
        d3.csv(file)
          .then((d) => {this.data = d;this.tick();});
          //.catch((error) => {console.error('can not read file: ' + file + ' ' + new Error().stack);});        
    }    
    
    tick() {
        requestAnimFrame(() => {this.tick();});
        this.draw(this.data);
        this.animate();
    }    
    
    draw(data) {

        let w = this.getWidth();
        let h = this.getHeight();
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, [0, 0.0, -10.0]);
        mat4.rotate(this.mvMatrix, this.degToRad(this.rCube), [0, 1, 0]);
        
        const yScale = d3.scaleLinear()
                       .domain([0, d3.max(data, function(d) {return +d.Value})])
                       .range([-1, 1]);
        if (this.gl) {
            for (var i = 0; i < data.length; i++) {
                this.mvPushMatrix();
                mat4.translate(this.mvMatrix, [i / 2 - 2, 0.0, 0.0]);
                const bar1 = new ThreeDBar(this.gl, this.shaderProgram, this.mvMatrix, this.rCube, {height: yScale(data[i].Value), offset: i / 2 - 2});
                this.mvPopMatrix();
            };
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
        let fragmentShader = this.getShader(this.gl, "shader-fs");
        let vertexShader = this.getShader(this.gl, "shader-vs");

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
        
        this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    } 
    
    getShader(gl, id) {
        let shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        let str = "";
        let k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3)
                str += k.textContent;
            k = k.nextSibling;
        }

        let shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        } else {
            return null;
        }

        this.gl.shaderSource(shader, str);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }    
    
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    animate() {
        let timeNow = new Date().getTime();
        if (this.lastTime != 0) {
          let elapsed = timeNow - this.lastTime;

          this.rCube -= (75 * elapsed) / 1000.0;
        }
        this.lastTime = timeNow;
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