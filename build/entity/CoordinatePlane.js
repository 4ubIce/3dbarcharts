'use strict';

define('CoordinatePlane', ['ClassHelper'], function (ClassHelper) {

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
            return this.cfg.height;
        },

        getWidth: function getWidth() {
            return this.cfg.width;
        },

        getxTicksCount: function getxTicksCount() {
            return this.cfg.xTicksCount;
        },

        getyTicksCount: function getyTicksCount() {
            return this.cfg.yTicksCount;
        },

        getTickStep: function getTickStep() {
            return this.cfg.tickStep;
        },

        getyLedge: function getyLedge() {
            return this.cfg.ledge;
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

        init: function init() {
            this.initBuffers();
            return this;
        },

        initBuffers: function initBuffers() {

            var x = this.getX();
            var y = this.getY();
            var z = this.getZ();
            var width = this.getWidth();
            var height = this.getHeight();
            var xTicksCount = this.getxTicksCount();
            var yTicksCount = this.getyTicksCount();
            var ledge = this.getyLedge();
            var xlp = width / (xTicksCount - 1);
            var ylp = this.getTickStep();

            this.cubeVertexPositionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
            var vertices = [];
            for (var i = 0; i < yTicksCount; i++) {
                vertices = vertices.concat([x - ledge, y + i * ylp, z, x + width + ledge, y + i * ylp, z]);
            }

            for (var _i = 0; _i < xTicksCount; _i++) {
                vertices = vertices.concat([x + _i * xlp, y - ledge, z, x + _i * xlp, y + height + ledge, z]);
            }
            this.cubeVertexPositionBuffer.itemSize = 3;
            this.cubeVertexPositionBuffer.numItems = 2 * (xTicksCount + yTicksCount);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

            this.cubeVertexColorBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
            this.cubeVertexColorBuffer.itemSize = 4;
            this.cubeVertexColorBuffer.numItems = 2 * (xTicksCount + yTicksCount);
            var colors = [];
            for (var _i2 = 0; _i2 < 2 * (xTicksCount + yTicksCount); _i2++) {
                colors = colors.concat([0.0, 0.0, 0.0, 1.0]);
            }
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

            this.lineVertexIndexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.lineVertexIndexBuffer);
            var lineVertexIndices = [];
            for (var _i3 = 0; _i3 < 2 * (xTicksCount + yTicksCount); _i3 = _i3 + 2) {
                lineVertexIndices = lineVertexIndices.concat([_i3, _i3 + 1]);
            }
            this.lineVertexIndexBuffer.itemSize = 1;
            this.lineVertexIndexBuffer.numItems = 2 * (xTicksCount + yTicksCount);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineVertexIndices), this.gl.STATIC_DRAW);
        },

        draw: function draw() {

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

        setMatrixUniforms: function setMatrixUniforms() {
            this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
            this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
        },

        div: function div(val, by) {
            return Math.trunc(val / by);
        },

        degToRad: function degToRad(degrees) {
            return degrees * Math.PI / 180;
        }
    };

    return CoordinatePlane;
});