'use strict';
define('ShaderProgramm', ['Shaders'],  function(Shaders) {

    function ShaderProgramm() {
        this.gl;
        this.shaderProgram;
    }

    ShaderProgramm.prototype = {

        constructor: ShaderProgramm,
        
        init: function (element) {
            this.gl = this.initGL(element);
            this.shaderProgram = this.initShaderProgramm(this.gl);
        },
        
        initGL: function (canvas) {
        
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
        },

        initShaderProgramm: function (gl) { 
                               
            let shaders = new Shaders();
            let fragmentShader = shaders.getShader('shader-fs', gl);
            let vertexShader = shaders.getShader('shader-vs', gl);
            let shaderProgram = gl.createProgram();
            
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
               alert("Could not initialise shaders");
            }

            gl.useProgram(shaderProgram);
            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
            shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
            gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
            shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
            gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);         
            shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
            gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);        
            
            shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
            shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
            shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
            shaderProgram.vColor1 = gl.getUniformLocation(shaderProgram, "vColor1");
            shaderProgram.vColor2 = gl.getUniformLocation(shaderProgram, "vColor2");
            shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
            shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
            shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
            shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");

            return shaderProgram;               
        }, 
    }
    
    return ShaderProgramm;
});