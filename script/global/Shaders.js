'use strict';

define('Shaders', function () {
  function Shaders() {}

  Shaders.prototype = {
    constructor: Shaders,
    getShader: function getShader(id, gl) {
      var shaderScript;
      var shader;

      if (id == 'shader-fs') {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        shaderScript = this.getFShaderScript();
      } else if (id == 'shader-vs') {
        shader = gl.createShader(gl.VERTEX_SHADER);
        shaderScript = this.getVShaderScript();
      } else {
        return null;
      }

      gl.shaderSource(shader, shaderScript);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
      }

      return shader;
    },
    getFShaderScript: function getFShaderScript() {
      var script = "precision mediump float;\n          \n                          varying vec2 vTextureCoord;\n                          varying vec4 vColor;\n                          varying vec3 vLightWeighting;\n                            \n                          uniform vec4 vColor1;\n                          uniform vec4 vColor2;\n                          uniform sampler2D uSampler;\n\n                          void main(void) {\n                              vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)) * vColor1 + vColor * vColor2;\n                              gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);                          \n                          }";
      return script;
    },
    getVShaderScript: function getVShaderScript() {
      var script = "attribute vec3 aVertexPosition;\n                          attribute vec3 aVertexNormal;\n                          attribute vec4 aVertexColor;\n                          attribute vec2 aTextureCoord;\n\n                          uniform mat4 uMVMatrix;\n                          uniform mat4 uPMatrix;\n                          uniform mat3 uNMatrix;\n                          uniform vec3 uAmbientColor;\n                          uniform vec3 uLightingDirection;\n                          uniform vec3 uDirectionalColor;\n                          varying vec4 vColor;\n                          varying vec2 vTextureCoord;\n                          varying vec3 vLightWeighting;                      \n\n\n                          void main(void) {\n                              gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n                              vTextureCoord = aTextureCoord;\n                              vec3 transformedNormal = uNMatrix * aVertexNormal;\n                              float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);\n                              vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;\n                              vColor = aVertexColor * vec4(vLightWeighting, 1.0);                          \n                          }";
      return script;
    }
  };
  return Shaders;
});