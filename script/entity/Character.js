'use strict';

define('Character', ['ClassHelper'], function (ClassHelper) {
  function Character(gl, shaderProgram, mvMatrix, config) {
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
      yRotation: 0,
      zRotation: 0
    };
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.canvas;
    this.mvMatrix = mvMatrix;
    this.pMatrix = mat4.create();
    this.ch = new ClassHelper();
    this.ch.loadConfig(this.cfg, config);
  }

  Character.prototype = {
    constructor: Character,
    getX: function getX() {
      return this.cfg.x;
    },
    getY: function getY() {
      return this.cfg.y;
    },
    getZ: function getZ() {
      return this.cfg.z;
    },
    getHeight: function getHeight() {
      return this.cfg.text.height;
    },
    getWidth: function getWidth() {
      return this.cfg.text.width;
    },
    getText: function getText() {
      return this.cfg.text.text;
    },
    getTextSize: function getTextSize() {
      return this.cfg.text.size;
    },
    getTextFont: function getTextFont() {
      return this.cfg.text.font;
    },
    getTextColor: function getTextColor() {
      return this.cfg.text.color;
    },
    getRotate: function getRotate() {
      return this.degToRad(this.cfg.rotate);
    },
    getxRotation: function getxRotation() {
      return this.cfg.xRotation;
    },
    getyRotation: function getyRotation() {
      return this.cfg.yRotation;
    },
    getzRotation: function getzRotation() {
      return this.cfg.zRotation;
    },
    init: function init() {
      this.initTextCanvas();
      this.initTexture();
      this.initBuffers();
      return this;
    },
    initTextCanvas: function initTextCanvas() {
      var text = this.getText();
      var size = this.getTextSize();
      var font = this.getTextFont();
      this.canvas = document.createElement('canvas');
      var context = this.canvas.getContext('2d');
      context.font = size + 'px ' + font;
      this.canvas.width = this.getPowerOfTwo(context.measureText(text).width);
      this.canvas.height = this.getPowerOfTwo(size);
      context.font = size + 'px ' + font;
      context.fillStyle = this.getTextColor();
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, this.canvas.width / 2, this.canvas.height / 2); //context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

      document.body.insertBefore(this.canvas, document.getElementById('barChart'));
    },
    initTexture: function initTexture() {
      this.textTexture = this.gl.createTexture();
      this.handleLoadedTexture(this.textTexture, this.canvas);
      this.canvas.remove();
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    },
    handleLoadedTexture: function handleLoadedTexture(texture, textureCanvas) {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, textureCanvas);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
    },
    initBuffers: function initBuffers() {
      var x = this.getX();
      var y = this.getY();
      var z = this.getZ();
      var width = this.getWidth();
      var height = this.getHeight();
      this.squareVertexPositionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
      var vertices = [width, height, 0, 0, height, 0, width, 0, 0, 0, 0, 0];
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
      this.squareVertexPositionBuffer.itemSize = 3;
      this.squareVertexPositionBuffer.numItems = 4;
      this.squareVertexTextureCoordBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexTextureCoordBuffer);
      var textureCoords = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
      this.squareVertexTextureCoordBuffer.itemSize = 2;
      this.squareVertexTextureCoordBuffer.numItems = 4;
      this.squareVertexColorBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexColorBuffer);
      var colors = [1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0];
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
      this.squareVertexColorBuffer.itemSize = 4;
      this.squareVertexColorBuffer.numItems = 4;
      this.lineVertexIndexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.lineVertexIndexBuffer);
      var lineVertexIndices = [0, 1, 2, 3];
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineVertexIndices), this.gl.STATIC_DRAW);
      this.lineVertexIndexBuffer.itemSize = 1;
      this.lineVertexIndexBuffer.numItems = 4;
    },
    draw: function draw() {
      var x = this.getX();
      var y = this.getY();
      var z = this.getZ();
      var rotate = this.getRotate();
      var xRotation = this.getxRotation();
      var yRotation = this.getyRotation();
      var zRotation = this.getzRotation();
      var whiteColor = new Float32Array([1, 1, 1, 1]);
      var blackColor = new Float32Array([0, 0, 0, 1]);
      mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
      mat4.translate(this.mvMatrix, [x, y, z]);
      mat4.rotate(this.mvMatrix, rotate, [xRotation, yRotation, zRotation]);
      this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
      this.gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
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
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.lineVertexIndexBuffer);
      this.setMatrixUniforms(); //this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);

      this.gl.drawElements(this.gl.TRIANGLE_STRIP, this.lineVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
    },
    setMatrixUniforms: function setMatrixUniforms() {
      this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
      this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    },
    degToRad: function degToRad(degrees) {
      return degrees * Math.PI / 180;
    },
    getPowerOfTwo: function getPowerOfTwo(value, pow) {
      pow = pow || 1;

      while (pow < value) {
        pow *= 2;
      }

      return pow;
    }
  };
  return Character;
});