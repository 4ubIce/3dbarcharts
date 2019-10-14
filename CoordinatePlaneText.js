'use strict';
class CoordinatePlaneText extends ClassHelper {

    constructor(gl, shaderProgram, mvMatrix, config) {
        super();
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
            yRotation: 0,
            zRotation: 0,
            k: 0,
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
                      position: 'x'                      
            }
        };
        this.axis;
        this.chars = [];
        this.mvMatrix = mvMatrix;
        this.mvMatrixStack = [];
        super.loadConfig(config);
    }

    getX() {
        return this.cfg.x;
    }     
 
    getY() {
        return this.cfg.y;
    }

    getZ() {
        return this.cfg.z;
    }
        
    getHeight() {
        return this.cfg.height;
    }
    
    getWidth() {
        return this.cfg.width;
    }
    
    getxTicksCount() {
        return this.cfg.xTicksCount;
    }
    
    getyTicksCount() {
        return this.cfg.yTicksCount;
    }
    
    getTickStep() {
        return this.cfg.tickStep;
    }       
     
    getLedge() {
        return this.cfg.ledge;
    }
    
    getRotate() {
        return this.degToRad(this.cfg.rotate);
    }
    
    getxRotation() {
        return this.cfg.xRotation;
    }
    
    getyRotation() {
        return this.cfg.yRotation;
    }
    
    getzRotation() {
        return this.cfg.zRotation;
    }
    
    getK() {
        return this.cfg.k;
    }          

    getText() {
        return this.cfg.text.text;
    }
    
    getTextSize() {
        return this.cfg.text.size;
    }
    
    getTextFont() {
        return this.cfg.text.font;
    }        
    
    getTextColor() {
        return this.cfg.text.color;
    }
    
    getTextWidth() {
        return this.cfg.text.width;
    } 

    getTextHeight() {
        return this.cfg.text.height;
    }
    
    getTextRotate() {
        return this.cfg.text.rotate;
    }
    
    getTextxRotation() {
        return this.cfg.text.xRotation;
    }
    
    getTextyRotation() {
        return this.cfg.text.yRotation;
    }            
    
    getTextPosition() {
        return this.cfg.text.position;
    }                  

    draw() {
        let xTexture, yTexture, zTexture; 
        let x = this.getX();
        let y = this.getY();
        let z = this.getZ();        
        let width = this.getWidth();
        let height = this.getHeight();
        let xTicksCount = this.getxTicksCount();
        let yTicksCount = this.getyTicksCount();
        let ledge = this.getLedge();
        let xlp = width / (xTicksCount - 1);
        let ylp = this.getTickStep();
        let rotate = this.getRotate();
        let xRotation = this.getxRotation();
        let yRotation = this.getyRotation();
        let zRotation = this.getzRotation();
        let k = this.getK();
        let t = this.getText();
        let textWidth = this.getTextWidth();
        let textHeight = this.getTextHeight();
        let textSize = this.getTextSize();
        let textFont = this.getTextFont();
        let textColor = this.getTextColor();
        let textRotate = this.getTextRotate();
        let textxRotation = this.getTextxRotation();
        let textyRotation = this.getTextyRotation();
        let posX = 0;
        let posY = 0;
        if (this.getTextPosition() == 'x') {
            posX = 1;
        } else {
            posY = 1;
        }

        mat4.translate(this.mvMatrix, [x, y, z]);
        mat4.rotate(this.mvMatrix, rotate, [xRotation, yRotation, zRotation]);
        this.axis = new CoordinatePlane(this.gl, this.shaderProgram, this.mvMatrix, {x: 0, y: 0, z: 0, width: width, height: height, xTicksCount: xTicksCount, yTicksCount: yTicksCount, tickStep: ylp, ledge: ledge});
        this.axis.draw();

        for (let i = 0; i < posX * yTicksCount + posY * xTicksCount; i++) {
            xTexture = posX * (width + ledge) + posY * (i * xlp - textWidth / 2 + k * textWidth);
            yTexture = posX * (i * ylp - textHeight / 2) + posY * (height + ledge + textHeight - k * textWidth);
            zTexture = 0;
            this.mvPushMatrix();
            let char = new Character(this.gl, this.shaderProgram, this.mvMatrix, {x: xTexture, y: yTexture, z: zTexture, text: {text: t[i], size: textSize, font: textFont, color: textColor, width: textWidth, height: textHeight}, rotate: textRotate, xRotation: textxRotation, yRotation: textyRotation});
            char.draw();
            this.chars.push(char);
            this.mvPopMatrix();
        }        
    }

    div(val, by){
        return Math.trunc(val / by);
    }

    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    mvPushMatrix() {
        let copy = mat4.create();
        mat4.set(this.mvMatrix, copy);
        this.mvMatrixStack.push(copy);
    }

    mvPopMatrix() {
        if (this.mvMatrixStack.length == 0) {
          throw "Invalid popMatrix!";
        }
        this.mvMatrix = this.mvMatrixStack.pop();
    }        
}


