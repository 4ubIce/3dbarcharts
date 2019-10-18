'use strict';
class Shaders {

    constructor() {

    }
        
    getShader(id, gl) {
        let shaderScript;
        let shader;
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
    }          
    
    getFShaderScript() {
        let script = `precision mediump float;
      
                      varying vec2 vTextureCoord;
                      varying vec4 vColor;
                      varying vec3 vLightWeighting;
                        
                      uniform vec4 vColor1;
                      uniform vec4 vColor2;
                      uniform sampler2D uSampler;

                      void main(void) {
                          vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)) * vColor1 + vColor * vColor2;
                          gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);                          
                      }`;
        return script;    
    }
    
    getVShaderScript() {
        let script = `attribute vec3 aVertexPosition;
                      attribute vec3 aVertexNormal;
                      attribute vec4 aVertexColor;
                      attribute vec2 aTextureCoord;

                      uniform mat4 uMVMatrix;
                      uniform mat4 uPMatrix;
                      uniform mat3 uNMatrix;
                      uniform vec3 uAmbientColor;
                      uniform vec3 uLightingDirection;
                      uniform vec3 uDirectionalColor;
                      varying vec4 vColor;
                      varying vec2 vTextureCoord;
                      varying vec3 vLightWeighting;                      


                      void main(void) {
                          gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                          vTextureCoord = aTextureCoord;
                          vec3 transformedNormal = uNMatrix * aVertexNormal;
                          float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
                          vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
                          vColor = aVertexColor * vec4(vLightWeighting, 1.0);                          
                      }`;
        return script;    
    }    
}    