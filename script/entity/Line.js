"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Line =
/*#__PURE__*/
function () {
  function Line(gl, shaderProgram, mvMatrix, config) {
    _classCallCheck(this, Line);

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
      margin: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      },
      barPadding: 0.1
    };
    this.mvMatrix = mvMatrix;
    this.pMatrix = mat4.create();
    this.mvMatrixStack = [];
    this.loadConfig(config);
    this.webGLStart();
  }

  _createClass(Line, [{
    key: "getX1",
    value: function getX1() {
      return this.cfg.x1;
    }
  }, {
    key: "getY1",
    value: function getY1() {
      return this.cfg.y1;
    }
  }, {
    key: "getZ1",
    value: function getZ1() {
      return this.cfg.z1;
    }
  }, {
    key: "getX2",
    value: function getX2() {
      return this.cfg.x2;
    }
  }, {
    key: "getY2",
    value: function getY2() {
      return this.cfg.y2;
    }
  }, {
    key: "getZ2",
    value: function getZ2() {
      return this.cfg.z2;
    }
  }, {
    key: "loadConfig",
    value: function loadConfig(config) {
      if ('undefined' !== typeof config) {
        for (var i in config) {
          if ('undefined' !== typeof config[i]) {
            this.cfg[i] = config[i];
          }
        }
      }
    }
  }, {
    key: "webGLStart",
    value: function webGLStart() {
      this.initBuffers(this.cfg.width / 2, this.cfg.height);
      this.tick();
    }
  }, {
    key: "initBuffers",
    value: function initBuffers(width, height) {
      var x1 = this.getX1();
      var y1 = this.getY1();
      var z1 = this.getZ1();
      var x2 = this.getX2();
      var y2 = this.getY2();
      var z2 = this.getZ2();
      this.cubeVertexPositionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
      var vertices = [x1, y1, z1, x2, y2, z2];
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
      this.cubeVertexPositionBuffer.itemSize = 3;
      this.cubeVertexPositionBuffer.numItems = 2;
      this.cubeVertexColorBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
      var colors = [[0.0, 0.0, 0.0, 1.0]];
      var unpackedColors = [];

      for (var i in colors) {
        var color = colors[i];

        for (var j = 0; j < 4; j++) {
          unpackedColors = unpackedColors.concat(color);
        }
      }

      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(unpackedColors), this.gl.STATIC_DRAW);
      this.cubeVertexColorBuffer.itemSize = 1;
      this.cubeVertexColorBuffer.numItems = 1;
    }
  }, {
    key: "tick",
    value: function tick() {
      this.drawScene();
    }
  }, {
    key: "drawScene",
    value: function drawScene() {
      mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
      this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
      this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
      this.setMatrixUniforms();
      this.gl.drawArrays(this.gl.LINES, 0, this.cubeVertexPositionBuffer.numItems);
    }
  }, {
    key: "setMatrixUniforms",
    value: function setMatrixUniforms() {
      this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
      this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    }
  }]);

  return Line;
}();