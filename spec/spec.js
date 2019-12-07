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

requirejs(['ClassHelper'], function(ClassHelper) {
    describe('ClassHelper', function() {

        let ch = new ClassHelper();

        describe('new ClassHelper()', function() {
            it('should be defined', function() {
                expect(ch).toBeDefined();
            });
        });
/*        
        describe('ClassHelper().loadConfig(cfg, config)', function() {

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
*/        
    });
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

requirejs(['ShaderProgramm','Shaders'], function(ShaderProgramm, Shaders) {
    describe('ShaderProgramm', function() {

        let sp = new ShaderProgramm();

        describe('new ShaderProgramm()', function() {
            it('should be defined', function() {
                expect(sp).toBeDefined();
            });
        });
        
        sp.init(document.querySelector('.barChart1'));
        let gl = sp.gl;
        
        describe('ShaderProgramm().init(element)', function() {
            it('should init gl and shaderProgram', function() {
                expect(sp.gl).toBeDefined();
                expect(sp.gl.viewportWidth).toBeGreaterThan(0);
                expect(sp.gl.viewportHeight).toBeGreaterThan(0);
                expect(sp.shaderProgram).toBeDefined();
                expect(sp.shaderProgram.vertexPositionAttribute).toBeDefined();
                expect(sp.shaderProgram.vertexColorAttribute).toBeDefined();
                expect(sp.shaderProgram.vertexNormalAttribute).toBeDefined();
                expect(sp.shaderProgram.textureCoordAttribute).toBeDefined();
                expect(sp.shaderProgram.pMatrixUniform).toBeDefined();
                expect(sp.shaderProgram.mvMatrixUniform).toBeDefined();
                expect(sp.shaderProgram.nMatrixUniform).toBeDefined();
                expect(sp.shaderProgram.samplerUniform).toBeDefined();
                expect(sp.shaderProgram.vColor1).toBeDefined();
                expect(sp.shaderProgram.vColor2).toBeDefined();
                //expect(sp.shaderProgram.useLightingUniform).toBeDefined();
                expect(sp.shaderProgram.ambientColorUniform).toBeDefined();
                expect(sp.shaderProgram.lightingDirectionUniform).toBeDefined();
                expect(sp.shaderProgram.directionalColorUniform).toBeDefined();
            });
        });
        
        describe('Shaders', function() {
        
            let shader = new Shaders();
        
            describe('new Shaders()', function() {
                it('should be defined', function() {
                    expect(shader).toBeDefined();
                });
            });
            
            describe('Shaders().getShader(shader-fs)', function() {
            
                let fs = shader.getShader('shader-fs', gl);
            
                it('should be compile FRAGMENT_SHADER', function() {
                    expect(gl.getShaderParameter(fs, gl.COMPILE_STATUS)).toBe(true);
                });
            });
            
            describe('Shaders().getShader(shader-vs)', function() {
            
                let vs = shader.getShader('shader-vs', gl);
            
                it('should be compile VERTEX_SHADER', function() {
                    expect(gl.getShaderParameter(vs, gl.COMPILE_STATUS)).toBe(true);
                });
            });                        
        });        
    });
});

requirejs(['ThreeDBarChart', 'ThreeDBar', 'CoordinatePlaneText', 'CoordinatePlane', 'Character', 'Buffers'],
    function(ThreeDBarChart, ThreeDBar, CoordinatePlaneText, CoordinatePlane, Character, Buffers) {
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
        
        function getBarCount(d) {
            let result = 0;
            for (let i = 0; i < d.length; i++) {
                result = result + d[i][Object.keys(d[i])[0]].length;
            };
            return result;            
        }        
        
        //let file = './data/data1.json';
        let l = 0.2;
        let as = -0.05;
        let ts = 28;
        let tw = 0.4;
        let xtc = 7;
        let ytc = 4;
        let d = [
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
        let barCount = getBarCount(d);
        let barChart = new MyThreeDBarChart(document.querySelector('.barChart1'), {ledge: l, animationSpeed: as, text: {size: ts, width: tw}}, d);
        let gl = barChart.gl;
        let sp = barChart.shaderProgram;
        let mvMatrix = barChart.mvMatrix;
        
        let axis = new CoordinatePlaneText(gl, sp, mvMatrix, {xTicksCount: xtc, yTicksCount: ytc, ledge: l, text: {text: ['a1', 'a2'], size: ts, width: tw}});
        
        
        describe('new ThreeDBarChart()', function() {
            it('should be defined', function() {
                expect(barChart).toBeDefined();
            });
            it('ThreeDBarChart().gl should be defined', function() {
               expect(barChart.gl).toBeDefined();
            });
            it('ThreeDBarChart().shaderProgram should be defined', function() {
                expect(barChart.shaderProgram).toBeDefined();
            });
            it('ThreeDBarChart().сlassHelper should be defined', function() {
                expect(barChart.ch).toBeDefined();
            }); 
            it('ThreeDBarChart().matrixStack should be defined', function() {
               expect(barChart.ms).toBeDefined();
            });
            it('ThreeDBarChart().mvMatrix should be defined', function() {
               expect(barChart.mvMatrix).toBeDefined();
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
                expect(barChart.axisArray[0].getxTicksCount()).toEqual(barChart.maxColumnCount);
            });
            it('axisArray[0] (axisX) should include ' + rowCount + ' "Y" ticks count', function() {
                expect(barChart.axisArray[0].getyTicksCount()).toEqual(rowCount);
                expect(barChart.axisArray[0].getyTicksCount()).toEqual(barChart.rowCount);
            });
        });
        
        describe('ThreeDBarChart().barArray', function() {
            it('barArray.length should be ' + barCount, function() {
                expect(barChart.barArray.length).toEqual(barCount);
            });
            it('barArray[5] color should be red', function() {
                expect(barChart.barArray[5].cfg.barColor).toEqual('#ff0000');
            });
            it('barArray[17] color should be green', function() {
                expect(barChart.barArray[17].cfg.barColor).toEqual('#00ff00');
            });
            it('barArray[29] color should be blue', function() {
                expect(barChart.barArray[29].cfg.barColor).toEqual('#0000ff');
            });                                    
        });
        
        describe('ThreeDBar', function() {
        
            let bw = 0.4;
            let bh = 0.8;
            let bc = '#fff000';        
            let bar = new ThreeDBar(gl, sp, mvMatrix, {width: bw, height: bh, barColor: bc});
            
            describe('new ThreeDBar()', function() {
                it('should be defined', function() {
                   expect(bar).toBeDefined();
                });
            }); 
            
            describe('ThreeDBar().loadConfig()', function() {
                it('should fill ThreeDBar().cfg properly', function() {
                    expect(bar.cfg.width).toEqual(bw);
                    expect(bar.cfg.height).toEqual(bh);
                    expect(bar.cfg.barColor).toEqual(bc);
                });
            });
            
            describe('ThreeDBar().init()', function() {             
                bar.init();
                it('should be initialize buffers and textures', function() {
                   expect(bar.cubeVertexPositionBuffer).toBeDefined();
                   expect(bar.cubeVertexColorBuffer).toBeDefined();
                   expect(bar.cubeVertexIndexBuffer).toBeDefined();
                   expect(bar.whiteTexture).toBeDefined();
                });
            });
            
            describe('ThreeDBar().hexToRgb()', function() {
                it(' work well', function() {
                   expect(bar.hexToRgb('#ff0000')).toEqual([1, 0, 0, 1]);
                   expect(bar.hexToRgb('#00ff00')).toEqual([0, 1, 0, 1]);
                   expect(bar.hexToRgb('#0000ff')).toEqual([0, 0, 1, 1]);
                });                                                                       
            });                                            
            
        });

        describe('CoordinatePlaneText', function() {
            
            let cptw = 1.75;
            let cpth = 0.9;
            let cptxtc = 3;
            let cptytc = 5;
            let cptl = 0.1;
            let cpttt = ['a1', 'a2', 'cd3'];
            let cptts = 12;
            let cpttc = '#00ffff';
            let cpttp = 'y';           
            
            let coordPlaneText = new CoordinatePlaneText(gl, sp, mvMatrix, {width: cptw, height: cpth, xTicksCount: cptxtc, yTicksCount: cptytc, ledge: cptl, text: {text: cpttt, size: cptts, color: cpttc, position: cpttp}}); 
            
            describe('new CoordinatePlaneText()', function() {
                it('should be defined', function() {
                   expect(coordPlaneText).toBeDefined();
                });
                it('CoordinatePlaneText().сlassHelper should be defined', function() {
                    expect(coordPlaneText.ch).toBeDefined();
                }); 
                it('CoordinatePlaneText().matrixStack should be defined', function() {
                   expect(coordPlaneText.ms).toBeDefined();
                });                
            }); 
            
            describe('CoordinatePlaneText().loadConfig()', function() {
                it('should fill CoordinatePlaneText().cfg properly', function() {
                    expect(coordPlaneText.cfg.width).toEqual(cptw);
                    expect(coordPlaneText.cfg.height).toEqual(cpth);
                    expect(coordPlaneText.cfg.xTicksCount).toEqual(cptxtc);
                    expect(coordPlaneText.cfg.yTicksCount).toEqual(cptytc);
                    expect(coordPlaneText.cfg.ledge).toEqual(cptl);
                    expect(coordPlaneText.cfg.text.text).toEqual(cpttt);
                    expect(coordPlaneText.cfg.text.size).toEqual(cptts);
                    expect(coordPlaneText.cfg.text.color).toEqual(cpttc);
                    expect(coordPlaneText.cfg.text.position).toEqual(cpttp);
                });
            });
            
            describe('CoordinatePlaneText().init()', function() {             
                coordPlaneText.init();
                it('should be initialize CoordinatePlane and Character', function() {
                   expect(coordPlaneText.axisPlane).toBeDefined();
                   expect(coordPlaneText.axisPlane.cfg.width).toEqual(cptw);
                   expect(coordPlaneText.axisPlane.cfg.height).toEqual(cpth);
                   expect(coordPlaneText.axisPlane.cfg.xTicksCount).toEqual(cptxtc);
                   expect(coordPlaneText.axisPlane.cfg.yTicksCount).toEqual(cptytc);
                   expect(coordPlaneText.axisPlane.cfg.ledge).toEqual(cptl);
                   expect(coordPlaneText.axisChars).toBeDefined();
                   expect(coordPlaneText.axisChars.length).toEqual(cptxtc);
                   expect(coordPlaneText.axisChars[0].cfg.text.text).toEqual(cpttt[0]);
                   expect(coordPlaneText.axisChars[1].cfg.text.text).toEqual(cpttt[1]);
                   expect(coordPlaneText.axisChars[2].cfg.text.text).toEqual(cpttt[2]);
                   expect(coordPlaneText.axisChars[0].cfg.text.size).toEqual(cptts);
                   expect(coordPlaneText.axisChars[0].cfg.text.color).toEqual(cpttc);
                });
            });
            
            describe('CoordinatePlaneText().degToRad()', function() {
                it('work well', function() {
                   expect(Math.round(coordPlaneText.degToRad(270)*100)/100).toEqual(4.71);
                   expect(Math.round(coordPlaneText.degToRad(87)*100)/100).toEqual(1.52);
                   expect(Math.round(coordPlaneText.degToRad(-45)*100)/100).toEqual(-0.79);
                });                                                                       
            });             
               
            describe('CoordinatePlane', function() {
             
                let cpw = 2.5;
                let cph = 1.5;
                let cpr = 90;
                let cprx = 1; 
                 
                let coordPlane = new CoordinatePlane(gl, sp, mvMatrix, {width: cpw, height: cph, ledge: l, rotate: cpr, xRotation: cprx});

                describe('new CoordinatePlane()', function() {
                    it('should be defined', function() {
                       expect(coordPlane).toBeDefined();
                    });
                }); 
                
                describe('CoordinatePlane().loadConfig()', function() {
                    it('should fill CoordinatePlane().cfg properly', function() {
                        expect(coordPlane.cfg.width).toEqual(cpw);
                        expect(coordPlane.cfg.height).toEqual(cph);
                        expect(coordPlane.cfg.ledge).toEqual(l);
                        expect(coordPlane.cfg.rotate).toEqual(cpr);
                        expect(coordPlane.cfg.xRotation).toEqual(cprx);
                    });
                });
                
                describe('CoordinatePlane().init()', function() {             
                    coordPlane.init();
                    it('should be initialize buffers', function() {
                       expect(coordPlane.cubeVertexPositionBuffer).toBeDefined();
                       expect(coordPlane.cubeVertexColorBuffer).toBeDefined();
                       expect(coordPlane.lineVertexIndexBuffer).toBeDefined();
                    });
                });
                
                describe('CoordinatePlane().div()', function() {
                    it('work well', function() {
                       expect(coordPlane.div(11,3)).toEqual(3);
                       expect(coordPlane.div(9,3)).toEqual(3);
                       expect(coordPlane.div(12,3)).toEqual(4);
                    });                                                                       
                });                                            
                
                describe('CoordinatePlane().degToRad()', function() {
                    it('work well', function() {
                       expect(Math.round(coordPlane.degToRad(270)*100)/100).toEqual(4.71);
                       expect(Math.round(coordPlane.degToRad(87)*100)/100).toEqual(1.52);
                       expect(Math.round(coordPlane.degToRad(-45)*100)/100).toEqual(-0.79);
                    });                                                                       
                });            
            });                
                  
            describe('Character', function() {
             
                let cx = -0.5;
                let cy = 2.5;
                let ctt = 'f1';
                let cts = 12;
                let ctc = '#ff00ff';
                let ctw = 0.5;
                let cr = 270;
                let crx = 1;
                let cry = 1;
                
                let character = new Character(gl, sp, mvMatrix, {x: cx, y: cy, text: {text: ctt, size: cts, color: ctc, width: ctw}, rotate: cr, xRotation: crx, yRotation: cry});

                describe('new Character()', function() {
                    it('should be defined', function() {
                       expect(character).toBeDefined();
                    });
                }); 
                
                describe('Character().loadConfig()', function() {
                    it('should fill CoordinatePlane().cfg properly', function() {
                        expect(character.cfg.x).toEqual(cx);
                        expect(character.cfg.y).toEqual(cy);
                        expect(character.cfg.text.text).toEqual(ctt);
                        expect(character.cfg.text.size).toEqual(cts);
                        expect(character.cfg.text.color).toEqual(ctc);
                        expect(character.cfg.text.width).toEqual(ctw);
                        expect(character.cfg.rotate).toEqual(cr);
                        expect(character.cfg.xRotation).toEqual(crx);
                        expect(character.cfg.yRotation).toEqual(cry);
                    });
                });
                
                describe('Character().init()', function() {             
                    character.init();
                    it('should be initialize canvas, buffers and texture', function() {
                       expect(character.canvas).toBeDefined();
                       expect(character.squareVertexPositionBuffer).toBeDefined();
                       expect(character.squareVertexTextureCoordBuffer).toBeDefined();
                       expect(character.squareVertexColorBuffer).toBeDefined();
                       expect(character.lineVertexIndexBuffer).toBeDefined();
                       expect(character.textTexture).toBeDefined();
                    });
                });
                
                describe('Character().getPowerOfTwo()', function() {
                    it('should return the nearest number that is a power of two', function() {
                       expect(character.getPowerOfTwo(3)).toEqual(4);
                       expect(character.getPowerOfTwo(25)).toEqual(32);
                       expect(character.getPowerOfTwo(7.1)).toEqual(8);
                    });                                                                       
                });                                            
                
                describe('Character().degToRad()', function() {
                    it('work well', function() {
                       expect(Math.round(character.degToRad(270)*100)/100).toEqual(4.71);
                       expect(Math.round(character.degToRad(87)*100)/100).toEqual(1.52);
                       expect(Math.round(character.degToRad(-45)*100)/100).toEqual(-0.79);
                    });                                                                       
                });            
            });
        });
        
        describe('Buffers', function() {
      
            let buffer = new Buffers(gl, sp);
            
            describe('new Buffers()', function() {
                it('should be defined', function() {
                   expect(buffer).toBeDefined();
                });
            }); 
            
            describe('Buffers().init()', function() {             
                buffer.init();
                it('should be initialize buffers', function() {
                   expect(buffer.cubeVertexNormalBuffer).toBeDefined();
                   expect(buffer.cubeVertexNormalBuffer.itemSize).toBeGreaterThan(0);
                   expect(buffer.cubeVertexNormalBuffer.numItems).toBeGreaterThan(0);
                });
            });
        });        
                        
    }); 
             
});