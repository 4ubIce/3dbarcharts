'use strict';

define('CoordinatePlaneText', ['CoordinatePlane', 'Character', 'ClassHelper', 'MatrixStack'], function (CoordinatePlane, Character, ClassHelper, MatrixStack) {

    function CoordinatePlaneText(gl, shaderProgram, mvMatrix, config) {
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
            yRotation: 0,
            zRotation: 0,
            text: {
                text: [],
                size: 24,
                font: 'Georgia',
                color: '#000000',
                width: 0.3,
                height: 0.3,
                rotate: 0,
                xRotation: 0,
                yRotation: 0,
                zRotation: 0,
                position: 'x',
                offset: 0
            }
        };
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.axisPlane;
        this.axisChars = [];
        this.mvMatrix = mvMatrix;
        this.ms = new MatrixStack();
        this.ch = new ClassHelper();
        this.ch.loadConfig(this.cfg, config);
    }

    CoordinatePlaneText.prototype = {

        constructor: CoordinatePlaneText,

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

        getLedge: function getLedge() {
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

        getzRotation: function getzRotation() {
            return this.cfg.zRotation;
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

        getTextWidth: function getTextWidth() {
            return this.cfg.text.width;
        },

        getTextHeight: function getTextHeight() {
            return this.cfg.text.height;
        },

        getTextRotate: function getTextRotate() {
            return this.cfg.text.rotate;
        },

        getTextxRotation: function getTextxRotation() {
            return this.cfg.text.xRotation;
        },

        getTextyRotation: function getTextyRotation() {
            return this.cfg.text.yRotation;
        },

        getTextzRotation: function getTextzRotation() {
            return this.cfg.text.zRotation;
        },

        getTextPosition: function getTextPosition() {
            return this.cfg.text.position;
        },

        getOffset: function getOffset() {
            return this.cfg.text.offset;
        },

        init: function init() {

            var xTexture = void 0,
                yTexture = void 0,
                zTexture = void 0;
            var width = this.getWidth();
            var height = this.getHeight();
            var xTicksCount = this.getxTicksCount();
            var yTicksCount = this.getyTicksCount();
            var ledge = this.getLedge();
            var xlp = width / (xTicksCount - 1);
            var ylp = this.getTickStep();
            var offset = this.getOffset();
            var t = this.getText();
            var textWidth = this.getTextWidth();
            var textHeight = this.getTextHeight();
            var textSize = this.getTextSize();
            var textFont = this.getTextFont();
            var textColor = this.getTextColor();
            var textRotate = this.getTextRotate();
            var textxRotation = this.getTextxRotation();
            var textyRotation = this.getTextyRotation();
            var textzRotation = this.getTextzRotation();
            var posX = 0;
            var posY = 0;

            if (this.getTextPosition() == 'x') {
                posX = 1;
            } else {
                posY = 1;
            }

            this.axisPlane = new CoordinatePlane(this.gl, this.shaderProgram, this.mvMatrix, { x: 0, y: 0, z: 0, width: width, height: height,
                xTicksCount: xTicksCount, yTicksCount: yTicksCount, tickStep: ylp, ledge: ledge }).init();

            for (var i = 0; i < posX * yTicksCount + posY * xTicksCount; i++) {
                xTexture = posX * (width + ledge) + posY * (i * xlp - textWidth / 2 + offset);
                yTexture = posX * (i * ylp - textHeight / 2) + posY * (height + ledge + textHeight - offset);
                zTexture = 0;
                var axisChar = new Character(this.gl, this.shaderProgram, this.mvMatrix, { x: xTexture, y: yTexture, z: zTexture,
                    text: { text: t[i], size: textSize, font: textFont, color: textColor, width: textWidth, height: textHeight },
                    rotate: textRotate, xRotation: textxRotation, yRotation: textyRotation, zRotation: textzRotation }).init();
                this.axisChars.push(axisChar);
            }
            return this;
        },

        draw: function draw() {

            var x = this.getX();
            var y = this.getY();
            var z = this.getZ();
            var rotate = this.getRotate();
            var xRotation = this.getxRotation();
            var yRotation = this.getyRotation();
            var zRotation = this.getzRotation();

            mat4.translate(this.mvMatrix, [x, y, z]);
            mat4.rotate(this.mvMatrix, rotate, [xRotation, yRotation, zRotation]);

            this.axisPlane.mvMatrix = this.mvMatrix;
            this.axisPlane.draw();

            for (var i = 0; i < this.axisChars.length; i++) {
                this.ms.push(this.mvMatrix);
                this.axisChars[i].mvMatrix = this.mvMatrix;
                this.axisChars[i].draw();
                this.mvMatrix = this.ms.pop();
            }
        },

        div: function div(val, by) {
            return Math.trunc(val / by);
        },

        degToRad: function degToRad(degrees) {
            return degrees * Math.PI / 180;
        }
    };

    return CoordinatePlaneText;
});