'use strict';

require('amd-loader');

const assert = require('assert');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const requirejs = require('requirejs');
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

describe('MatrixStack', function() {

    let MatrixStack = requirejs('MatrixStack');
    let stack = new MatrixStack();

    describe('new MatrixStack()', function() {
        it('should contain empty array', function() {
          assert.equal(stack.matrixStack.length, 0);
        });
    });
    
    describe('MatrixStack().push(matrix)', function() {

        let mat = require('gl-Matrix');
        let m = mat.mat4.create();

        it('should push matrix into array', function() {
            stack.push(m);
            assert(stack.matrixStack.length > 0);
        });
    });
    
    describe('MatrixStack().pop()', function() {
        it('should return matrix and remove element from array', function() {
            let m = stack.pop();
            assert.equal(stack.matrixStack.length, 0);
            assert.equal(m.length, 16);
        });
    });        
});

describe('ThreeDBarChart', function() {

    const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
    console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
/*
    let ThreeDBarChart = requirejs('ThreeDBarChart');
    let barChart = new ThreeDBarChart();

    describe('new MatrixStack()', function() {
        it('should contain empty array', function() {
          assert.equal(stack.matrixStack.length, 0);
        });
    });
    
    describe('MatrixStack().push(matrix)', function() {

        let mat = require('gl-Matrix');
        let m = mat.mat4.create();

        it('should push matrix into array', function() {
            stack.push(m);
            assert(stack.matrixStack.length > 0);
        });
    });
    
    describe('MatrixStack().pop()', function() {
        it('should return matrix and remove element from array', function() {
            let m = stack.pop();
            assert.equal(stack.matrixStack.length, 0);
            assert.equal(m.length, 16);
        });
    });
*/            
});