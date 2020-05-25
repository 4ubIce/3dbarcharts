'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

define('ThreeDBarChart', ['ShaderProgramm', 'ClassHelper', 'ThreeDBar', 'CoordinatePlaneText', 'MatrixStack', 'Buffers', 'd3js', 'glMatrix', 'utils'], function (ShaderProgramm, ClassHelper, ThreeDBar, CoordinatePlaneText, MatrixStack, Buffers, d3) {
    var _ThreeDBarChart$proto;

    function ThreeDBarChart(element, config, file) {
        var _this = this;

        this.cfg = {
            x: 0,
            y: 0,
            width: 4,
            height: 1,
            depth: 1,
            ledge: 0,
            animationSpeed: -0.02,
            axisTicksCount: 5,
            text: {
                size: 24,
                font: 'Georgia',
                color: '#000000',
                width: 0.3,
                height: 0.3
            }
        };
        var sp = new ShaderProgramm();
        sp.init(element);
        this.gl = sp.gl;
        this.shaderProgram = sp.shaderProgram;
        this.barArray = [];
        this.axisArray = [];
        this.animationOn = 0;
        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, [0.0, 0.0, -10.0]);
        this.xRotation = 0;
        this.zRotation = 0;
        this.ch = new ClassHelper();
        this.ch.loadConfig(this.cfg, config);
        this.ms = new MatrixStack();
        this.loadData(file);
        element.onmousedown = function (event) {
            _this.mouseDownEvent(event);
        };
        element.onmouseup = function () {
            _this.mouseUpEvent();
        };
        //this.element.oncontextmenu = () => {return false;};
    }

    ThreeDBarChart.prototype = (_ThreeDBarChart$proto = {

        constructor: ThreeDBarChart,

        getWidth: function getWidth() {
            return this.cfg.width;
        },

        getHeight: function getHeight() {
            return this.cfg.height;
        },

        getDepth: function getDepth() {
            return this.cfg.depth;
        }

    }, _defineProperty(_ThreeDBarChart$proto, 'getHeight', function getHeight() {
        return this.cfg.height;
    }), _defineProperty(_ThreeDBarChart$proto, 'getLedge', function getLedge() {
        return this.cfg.ledge;
    }), _defineProperty(_ThreeDBarChart$proto, 'getAnimationSpeed', function getAnimationSpeed() {
        return this.cfg.animationSpeed;
    }), _defineProperty(_ThreeDBarChart$proto, 'getaxisTicksCount', function getaxisTicksCount() {
        return this.cfg.axisTicksCount;
    }), _defineProperty(_ThreeDBarChart$proto, 'getTextSize', function getTextSize() {
        return this.cfg.text.size;
    }), _defineProperty(_ThreeDBarChart$proto, 'getTextFont', function getTextFont() {
        return this.cfg.text.font;
    }), _defineProperty(_ThreeDBarChart$proto, 'getTextColor', function getTextColor() {
        return this.cfg.text.color;
    }), _defineProperty(_ThreeDBarChart$proto, 'getTextWidth', function getTextWidth() {
        return this.cfg.text.width;
    }), _defineProperty(_ThreeDBarChart$proto, 'getTextHeight', function getTextHeight() {
        return this.cfg.text.height;
    }), _defineProperty(_ThreeDBarChart$proto, 'loadData', function loadData(file) {
        var _this2 = this;

        d3.json(file).then(function (d) {
            _this2.data = d;_this2.init(d);
        });
        //.catch((error) => {console.error('can not read file: ' + file + ' ' + new Error().stack);});        
    }), _defineProperty(_ThreeDBarChart$proto, 'tick', function tick() {
        var _this3 = this;

        if (this.animationOn == 1) {
            requestAnimFrame(function () {
                _this3.tick();
            });
            this.draw();
        }
    }), _defineProperty(_ThreeDBarChart$proto, 'initVariables', function initVariables() {
        this.gl.uniform3f(this.shaderProgram.ambientColorUniform, parseFloat("0.2"), parseFloat("0.2"), parseFloat("0.2"));
        var lightingDirection = [parseFloat("0.0"), parseFloat("0.0"), parseFloat("-1.0")];
        var adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -2);
        this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, adjustedLD);

        this.gl.uniform3f(this.shaderProgram.directionalColorUniform, parseFloat("0.8"), parseFloat("0.8"), parseFloat("0.8"));
    }), _defineProperty(_ThreeDBarChart$proto, 'init', function init(data) {
        var bc = void 0;
        var w = this.getWidth();
        var h = this.getHeight();
        var d = this.getDepth();
        var l = this.getLedge();
        var axisTicksCount = this.getaxisTicksCount();
        var ts = this.getTextSize();
        var tc = this.getTextColor();
        var tf = this.getTextFont();
        var tw = this.getTextWidth();
        var th = this.getTextHeight();
        var maxValue = d3.max(data, function (row) {
            return d3.max(d3.values(row)[0], function (val) {
                return val.Value;
            });
        });

        this.rowCount = data.length;
        this.maxColumnCount = d3.max(data, function (row) {
            return d3.values(d3.values(row)[0]).length;
        });

        var yScale = d3.scaleLinear().domain([0, maxValue]).range([-1, h]);

        var axisYValue = d3.ticks(0, maxValue, axisTicksCount);
        var tickStep = 1 + yScale(d3.tickStep(0, maxValue, axisTicksCount));

        var axisXValue = [];
        for (var i = 0; i < d3.values(data[0])[0].length; i++) {
            axisXValue = axisXValue.concat(d3.values(data[0])[0][i].Params);
        }

        var axisZValue = [];
        for (var _i = 0; _i < data.length; _i++) {
            axisZValue = axisZValue.concat(d3.keys(data[_i])[0]);
        }

        this.initVariables();
        this.buffers = new Buffers(this.gl, this.shaderProgram);

        for (var _i2 = 0; _i2 < data.length; _i2++) {
            bc = data[_i2].color;
            for (var j = 0; j < d3.values(data[_i2])[0].length; j++) {
                var bar = new ThreeDBar(this.gl, this.shaderProgram, this.mvMatrix, { height: yScale(d3.values(data[_i2])[0][j].Value), barColor: bc }).init();
                this.barArray.push(bar);
            };
        };

        var axisX = new CoordinatePlaneText(this.gl, this.shaderProgram, this.mvMatrix, { x: -w / 2, y: -d, z: 0, width: w, height: d,
            xTicksCount: this.maxColumnCount, yTicksCount: this.rowCount,
            tickStep: d / (this.rowCount - 1), ledge: l, rotate: 90, xRotation: 1,
            text: { text: axisXValue, size: ts, font: tf, color: tc, width: tw, height: th, position: 'y', rotate: 180, xRotation: 1 } }).init();
        this.axisArray.push(axisX);
        var axisY = new CoordinatePlaneText(this.gl, this.shaderProgram, this.mvMatrix, { x: -w / 2, y: -1, z: -l, width: w, height: 1 + yScale(maxValue),
            xTicksCount: this.maxColumnCount, yTicksCount: axisTicksCount,
            tickStep: tickStep, ledge: l,
            text: { text: axisYValue, size: ts, font: tf, color: tc, width: tw, height: th } }).init();
        this.axisArray.push(axisY);
        var axisZ = new CoordinatePlaneText(this.gl, this.shaderProgram, this.mvMatrix, { x: -w / 2 - l, y: -1, z: 0, width: d, height: 1 + yScale(maxValue),
            xTicksCount: this.rowCount, yTicksCount: axisTicksCount,
            tickStep: tickStep, ledge: l, rotate: -90, yRotation: 1,
            text: { text: axisZValue, size: ts, font: tf, color: tc, width: tw, height: th, position: 'y', rotate: -180, yRotation: 1, offset: this.getTextWidth() } }).init();
        this.axisArray.push(axisZ);

        this.draw();
    }), _defineProperty(_ThreeDBarChart$proto, 'draw', function draw() {

        var k = 0;
        var w = this.getWidth();
        var d = this.getDepth();
        var animationSpeed = this.getAnimationSpeed();

        this.buffers.init();

        if (this.gl) {
            mat4.rotate(this.mvMatrix, animationSpeed, [this.xRotation, 0, this.zRotation]);
            for (var i = 0; i < this.data.length; i++) {
                for (var j = 0; j < d3.values(this.data[i])[0].length; j++) {
                    this.ms.push(this.mvMatrix);
                    mat4.translate(this.mvMatrix, [-w / 2 + j * w / (this.maxColumnCount - 1), 0.0, i * d / (this.rowCount - 1)]);
                    this.barArray[k].mvMatrix = this.mvMatrix;
                    this.barArray[k].draw();
                    this.mvMatrix = this.ms.pop();
                    k++;
                }
            };

            for (var _i3 = 0; _i3 < this.axisArray.length; _i3++) {
                this.ms.push(this.mvMatrix);
                this.axisArray[_i3].mvMatrix = this.mvMatrix;
                this.axisArray[_i3].draw();
                this.mvMatrix = this.ms.pop();
            }
        }
    }), _defineProperty(_ThreeDBarChart$proto, 'mouseDownEvent', function mouseDownEvent(e) {
        if (e.which == 1) {
            this.xRotation = 1;
        } else if (e.which == 2) {
            this.zRotation = 1;
        }
        this.animationOn = 1;
        this.tick();
    }), _defineProperty(_ThreeDBarChart$proto, 'mouseUpEvent', function mouseUpEvent() {
        this.xRotation = 0;
        this.yRotation = 0;
        this.zRotation = 0;
        this.animationOn = 0;
    }), _ThreeDBarChart$proto);

    return ThreeDBarChart;
});