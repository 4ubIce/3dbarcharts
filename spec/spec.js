'use strict';

requirejs.config({
    baseUrl: 'script',
    paths: {
		    d3js: '../lib/d3.v5.min',
        glMatrix: '../lib/glMatrix-0.9.5.min',
        utils: '../lib/webgl-utils', 
        ThreeDBarChart: './controllers/ThreeDBarChart',
        CoordinatePlaneText: './controllers/CoordinatePlaneText',
        MatrixStack: './controllers/helpers/MatrixStack',
        Character: './entity/Character',
        CoordinatePlane: './entity/CoordinatePlane',
        ThreeDBar: './entity/ThreeDBar',
        Buffers: './global/Buffers',
        ShaderProgramm: './global/ShaderProgramm',
        Shaders: './global/Shaders',
        ClassHelper: './helpers/ClassHelper'
    }
});

requirejs(['MatrixStack', 'glMatrix'], function(MatrixStack) {
    describe('MatrixStack', function() {

        let stack = new MatrixStack();

        describe('new MatrixStack()', function() {
            it('should contain empty array', function() {
                expect(0).toBe(stack.matrixStack.length);
            });
        });
        
        describe('MatrixStack().push(matrix)', function() {

            let m = mat4.create();

            it('should push matrix into array', function() {
                stack.push(m);
                expect(stack.matrixStack.length).toBeGreaterThan(0);
            });
        });
        
        describe('MatrixStack().pop()', function() {
            it('should return matrix and remove element from array', function() {
                let m = stack.pop();
                expect(stack.matrixStack.length).toEqual(0);
                expect(m.length).toEqual(16);
            });
        });
    });
});
requirejs(['ThreeDBarChart'], function(ThreeDBarChart) {
    describe('ThreeDBarChart', function() {
    
        class MyThreeDBarChart extends ThreeDBarChart {
            constructor(element, config, d) {
                super(element, config, d);
            }
                    
            loadData(d) {
                this.data = d;
                this.init(d);
            }                                
        }        
        
        function getRowCount(d) {
            return d.length;
        }                   
        
        function getBarCountByRow(d) {
            let result = [];
            for (let i = 0; i < d.length; i++) {
                result = result.concat(d[i][Object.keys(d[i])[0]].length);
            };
            return result;            
        }
        
        //let file = './data/data1.json';
        let l = 0.2;
        let as = -0.05;
        let ts = 28;
        let tw = 0.4;
        let d =
                  [
                    {
                    2017:
                      [
                        {Params: "Янв", Value: 35},
                        {Params: "Фев ", Value: 12},
                        {Params: "Мар", Value: 5},
                        {Params: "Апр", Value: 56},
                        {Params: "Май", Value: 58},
                        {Params: "Июн", Value: 78},
                        {Params: "Июл", Value: 59},
                        {Params: "Авг", Value: 26},
                        {Params: "Сен", Value: 8},
                        {Params: "Окт", Value: 24},
                        {Params: "Ноя", Value: 38},
                        {Params: "Дек", Value: 16}
                      ],
                    color: "#ff0000"
                    },
                    {
                    2018:
                      [
                        {Params: "Янв", Value: 9},
                        {Params: "Фев", Value: 4},
                        {Params: "Мар", Value: 15},
                        {Params: "Апр", Value: 62},
                        {Params: "Май", Value: 32},
                        {Params: "Июн", Value: 40},
                        {Params: "Июл", Value: 7},
                        {Params: "Авг", Value: 34},
                        {Params: "Сен", Value: 15},
                        {Params: "Окт", Value: 7},
                        {Params: "Ноя", Value: 19},
                        {Params: "Дек", Value: 53}                  
                      ],
                    color: "#00ff00"
                    },
                    {
                    2019:
                      [
                        {Params: "Янв", Value: 19},
                        {Params: "Фев", Value: 54},
                        {Params: "Мар", Value: 32},
                        {Params: "Апр", Value: 21},
                        {Params: "Май", Value: 35},
                        {Params: "Июн", Value: 62},
                        {Params: "Июл", Value: 42},
                        {Params: "Авг", Value: 6},
                        {Params: "Сен", Value: 43},
                        {Params: "Окт", Value: 52},
                        {Params: "Ноя", Value: 24},
                        {Params: "Дек", Value: 13}
                      ],
                    color: "#0000ff"
                    }    
                  ];
        let rowCount = getRowCount(d);
        let maxBarCountByRow = Math.max.apply(Math, getBarCountByRow(d));
        let barChart = new MyThreeDBarChart(document.querySelector('.barChart1'), {ledge: l, animationSpeed: as, text: {size: ts, width: tw}}, d);

        describe('new ThreeDBarChart()', function() {
            it('should be defined', function() {
              expect(barChart).toBeDefined();
            });
        });
         
        describe('ThreeDBarChart().loadConfig()', function() {
            it('should fill ThreeDBarChart().cfg properly', function() {
                expect(barChart.getLedge()).toEqual(l);
                expect(barChart.getAnimationSpeed()).toEqual(as);
                expect(barChart.getTextSize()).toEqual(ts);
                expect(barChart.getTextWidth()).toEqual(tw);
            });
        });        
        
        describe('ThreeDBarChart().axisArray', function() {
            it('axisArray[0] (axisX) should include ' + maxBarCountByRow + ' "X" ticks count', function() {
                expect(barChart.axisArray[0].getxTicksCount()).toEqual(maxBarCountByRow);
            });
            it('axisArray[0] (axisX) should include ' + rowCount + ' "Y" ticks count', function() {
                expect(barChart.axisArray[0].getyTicksCount()).toEqual(rowCount);
            });
        });
        
        
              
    });
});