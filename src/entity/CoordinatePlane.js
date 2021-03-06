﻿'use strict';
define('CoordinatePlane', ['ClassHelper'], function(ClassHelper) {

    function CoordinatePlane(gl, shaderProgram, mvMatrix, config) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.cfg = {
            x: 0,
            y: 0,
            z: 0,
            height: 1,
            width: 1,
            xTicksCount: 5,
            yTicksCount: 3,
            tickStep: 0.2,
            ledge: 0.0,
            rotate: 0,
            xRotation: 0,
            yRotation: 0
        };
        this.mvMatrix = mvMatrix;
        this.pMatrix = mat4.create();
        this.ch = new ClassHelper();
        this.ch.loadConfig(this.cfg, config);
    }

    CoordinatePlane.prototype = {

        constructor: CoordinatePlane,
        
        getX: function () {
            return this.cfg.x;
        },     
     
        getY: function () {
            return this.cfg.y;
        },

        getZ: function () {
            return this.cfg.z;
        },

        getHeight: function () {
            return this.cfg.height;
        },
        
        getWidth: function () {
            return this.cfg.width;
        },
        
        getxTicksCount: function () {
            return this.cfg.xTicksCount;
        },
        
        getyTicksCount: function () {
            return this.cfg.yTicksCount;
        },   

        getTickStep: function () {
            return this.cfg.tickStep;
        },
         
        getyLedge: function () {
            return this.cfg.ledge;
        },
        
        getRotate: function () {
            return this.degToRad(this.cfg.rotate);
        },
        
        getxRotation: function () {
            return this.cfg.xRotation;
        },
        
        getyRotation: function () {
            return this.cfg.yRotation;
        },           
        
        init: function () {
            this.initBuffers();
            return this;
        },

        initBuffers: function () {
                               
            let x = this.getX();
            let y = this.getY();
            let z = this.getZ();
            let width = this.getWidth();
            let height = this.getHeight();
            let xTicksCount = this.getxTicksCount();
            let yTicksCount = this.getyTicksCount();
            let ledge = this.getyLedge();
            let xlp = width / (xTicksCount - 1);
            let ylp = this.getTickStep();
      
            this.cubeVertexPositionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
            let vertices = [];
            for (let i = 0; i < yTicksCount; i++) {
               vertices = vertices.concat([x - ledge,         y + i * ylp, z,
                                           x + width + ledge, y + i * ylp, z]);
            }
            
            for (let i = 0; i < xTicksCount; i++) {
               vertices = vertices.concat([x + i * xlp, y - ledge,          z,
                                           x + i * xlp, y + height + ledge, z]);
            }
            this.cubeVertexPositionBuffer.itemSize = 3;
            this.cubeVertexPositionBuffer.numItems = 2 * (xTicksCount + yTicksCount);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

            this.cubeVertexColorBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
            this.cubeVertexColorBuffer.itemSize = 4;
            this.cubeVertexColorBuffer.numItems = 2 * (xTicksCount + yTicksCount);
            let colors = [];
            for (let i = 0; i < 2 * (xTicksCount + yTicksCount); i++) {
                colors = colors.concat([0.0, 0.0, 0.0, 1.0]);
            } 
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

            this.lineVertexIndexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.lineVertexIndexBuffer);
            let lineVertexIndices = [];
            for (let i = 0; i < 2 * (xTicksCount + yTicksCount); i = i + 2) {
                lineVertexIndices = lineVertexIndices.concat([i, i + 1]);
            }
            this.lineVertexIndexBuffer.itemSize = 1;
            this.lineVertexIndexBuffer.numItems = 2 * (xTicksCount + yTicksCount);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineVertexIndices), this.gl.STATIC_DRAW);
        },
        
        draw: function () {
        
            mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);

            this.gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
            this.gl.disableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
            //this.gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, 1, this.gl.FLOAT, false, 0, 0);
            //this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, 1, this.gl.FLOAT, false, 0, 0);
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
            
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.lineVertexIndexBuffer);
            
            this.setMatrixUniforms();
            //this.gl.drawArrays(this.gl.LINES, 0, this.cubeVertexPositionBuffer.numItems);
            this.gl.drawElements(this.gl.LINES, this.lineVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
        },

        setMatrixUniforms: function () {
           this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
           this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
        },
        
        div: function (val, by){
            return Math.trunc(val / by);
        },

        degToRad: function (degrees) {
            return degrees * Math.PI / 180;
        }    
    }

    return CoordinatePlane;
});


