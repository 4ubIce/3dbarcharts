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
        
        let file = './data/data1.json';
        let l = 0.2;
        let as = -0.05;
        let ts = 28;
        let tw = 0.4;        
        let barChart = new ThreeDBarChart(document.querySelector('.barChart1'), {ledge: l, animationSpeed: as, text: {size: ts, width: tw}}, file);

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
              
    });
});