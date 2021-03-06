﻿'use strict';
define('ThreeDBarChart', ['ShaderProgramm', 'ClassHelper', 'ThreeDBar',
                           'CoordinatePlaneText', 'MatrixStack', 'Buffers', 'd3js', 'glMatrix', 'utils']
                        , function(ShaderProgramm, ClassHelper, ThreeDBar, CoordinatePlaneText, MatrixStack, Buffers, d3) {

    function ThreeDBarChart(element, config, file) {
    
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
        element.onmousedown = (event) => {this.mouseDownEvent(event);};
        element.onmouseup = () => {this.mouseUpEvent();};
        //this.element.oncontextmenu = () => {return false;};
    }
    
    ThreeDBarChart.prototype = {

        constructor: ThreeDBarChart,
        
        getWidth: function () {
            return this.cfg.width;
        }, 
        
        getHeight: function () {
            return this.cfg.height;
        },
        
        getDepth: function () {
            return this.cfg.depth;
        }, 
        
        getHeight: function () {
            return this.cfg.height;
        },
        
        getLedge: function () {
            return this.cfg.ledge;
        },         
        
        getAnimationSpeed: function () {
            return this.cfg.animationSpeed;
        },
        
        getaxisTicksCount: function () {
            return this.cfg.axisTicksCount;
        },            

        getTextSize: function () {
            return this.cfg.text.size;
        },
        
        getTextFont: function () {
            return this.cfg.text.font;
        },        
        
        getTextColor: function () {
            return this.cfg.text.color;
        },
        
        getTextWidth: function () {
            return this.cfg.text.width;
        }, 

        getTextHeight: function () {
            return this.cfg.text.height;
        },

        loadData: function (file) {
            d3.json(file)
              .then((d) => {this.data = d;this.init(d);});
              //.catch((error) => {console.error('can not read file: ' + file + ' ' + new Error().stack);});        
        },    
        
        tick: function () {
            if (this.animationOn == 1) {
                requestAnimFrame(() => {this.tick();});
                this.draw();
            }
        },    
        
        initVariables: function () {
            this.gl.uniform3f(
              this.shaderProgram.ambientColorUniform,
              parseFloat("0.2"),
              parseFloat("0.2"),
              parseFloat("0.2")
            );
            let lightingDirection = [
              parseFloat("0.0"),
              parseFloat("0.0"),
              parseFloat("-1.0")
            ];
            let adjustedLD = vec3.create();
            vec3.normalize(lightingDirection, adjustedLD);
            vec3.scale(adjustedLD, -2);
            this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, adjustedLD);

            this.gl.uniform3f(
              this.shaderProgram.directionalColorUniform,
              parseFloat("0.8"),
              parseFloat("0.8"),
              parseFloat("0.8")
            );    
        },          
        
        init: function (data) {
            let bc;
            let w = this.getWidth();
            let h = this.getHeight();
            let d = this.getDepth();
            let l = this.getLedge();
            let axisTicksCount = this.getaxisTicksCount();
            let ts = this.getTextSize();
            let tc = this.getTextColor();
            let tf = this.getTextFont();
            let tw = this.getTextWidth();
            let th = this.getTextHeight();         
            let maxValue = d3.max(data, function(row) {return d3.max(d3.values(row)[0], function(val) {return val.Value})});
            
            this.rowCount = data.length;
            this.maxColumnCount = d3.max(data, function(row) {return d3.values(d3.values(row)[0]).length});

            const yScale = d3.scaleLinear()
                           .domain([0, maxValue])
                           .range([-1, h]);

            let axisYValue = d3.ticks(0, maxValue, axisTicksCount);
            let tickStep = 1 + yScale(d3.tickStep(0, maxValue, axisTicksCount));
            
            let axisXValue = [];
            for (let i = 0; i < d3.values(data[0])[0].length; i++) {
                axisXValue = axisXValue.concat(d3.values(data[0])[0][i].Params);
            }

            let axisZValue = [];
            for (let i = 0; i < data.length; i++) {
                axisZValue = axisZValue.concat(d3.keys(data[i])[0]);
            }
            
            this.initVariables();
            this.buffers = new Buffers(this.gl, this.shaderProgram);
            
            for (let i = 0; i < data.length; i++) {
                bc = data[i].color;
                for (let j = 0; j < d3.values(data[i])[0].length; j++) {
                    let bar = new ThreeDBar(this.gl, this.shaderProgram, this.mvMatrix,
                                     {height: yScale(d3.values(data[i])[0][j].Value), barColor: bc}).init();
                    this.barArray.push(bar);
                };
            };
            
            const axisX = new CoordinatePlaneText(this.gl, this.shaderProgram, this.mvMatrix,
                                 {x: -w / 2, y: -d, z: 0, width: w, height: d,
                                  xTicksCount: this.maxColumnCount, yTicksCount: this.rowCount,
                                  tickStep: d / (this.rowCount - 1), ledge: l, rotate: 90, xRotation: 1,
                                  text: {text: axisXValue, size: ts, font: tf, color: tc, width: tw, height: th, position: 'y', rotate: 180, xRotation: 1}}).init();
            this.axisArray.push(axisX);
            const axisY = new CoordinatePlaneText(this.gl, this.shaderProgram, this.mvMatrix,
                                 {x: -w / 2, y: -1, z: -l, width: w, height: 1 + yScale(maxValue),
                                  xTicksCount: this.maxColumnCount, yTicksCount: axisTicksCount,
                                  tickStep: tickStep, ledge: l,
                                  text: {text: axisYValue, size: ts, font: tf, color: tc, width: tw, height: th}}).init();     
            this.axisArray.push(axisY);
            const axisZ = new CoordinatePlaneText(this.gl, this.shaderProgram, this.mvMatrix,
                                 {x: -w / 2 - l, y: -1, z: 0, width: d, height: 1 + yScale(maxValue),
                                  xTicksCount: this.rowCount, yTicksCount: axisTicksCount,
                                  tickStep: tickStep, ledge: l, rotate: -90, yRotation: 1,
                                  text: {text: axisZValue, size: ts, font: tf, color: tc, width: tw, height: th, position: 'y', rotate: -180, yRotation: 1, offset: this.getTextWidth()}}).init();     
            this.axisArray.push(axisZ);
            
            this.draw();
        },
        
        draw: function () { 
            
            let k = 0;
            let w = this.getWidth();
            let d = this.getDepth();
            let animationSpeed = this.getAnimationSpeed();
                                           
            this.buffers.init();
            
            if (this.gl) {
                mat4.rotate(this.mvMatrix, animationSpeed, [this.xRotation, 0, this.zRotation]);
                for (let i = 0; i < this.data.length; i++) {
                    for (let j = 0; j < d3.values(this.data[i])[0].length; j++) {
                        this.ms.push(this.mvMatrix);
                        mat4.translate(this.mvMatrix, [-w / 2 + j * w / (this.maxColumnCount - 1), 0.0, i * d / (this.rowCount - 1)]);
                        this.barArray[k].mvMatrix = this.mvMatrix;
                        this.barArray[k].draw();
                        this.mvMatrix = this.ms.pop();
                        k++;
                    }
                };
                
                for (let i = 0; i < this.axisArray.length; i++) {
                    this.ms.push(this.mvMatrix);
                    this.axisArray[i].mvMatrix = this.mvMatrix;
                    this.axisArray[i].draw();
                    this.mvMatrix = this.ms.pop();
                }
            }
        },
        
        mouseDownEvent: function (e) {
            if (e.which == 1) {
                this.xRotation = 1;
            } else if (e.which == 2) {
                this.zRotation = 1;
            }
            this.animationOn = 1;
            this.tick();
        },
        
        mouseUpEvent: function () {
            this.xRotation = 0;
            this.yRotation = 0;
            this.zRotation = 0;
            this.animationOn = 0;
        }
    }
    
    return ThreeDBarChart;
});