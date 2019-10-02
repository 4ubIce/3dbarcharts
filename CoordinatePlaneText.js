'use strict';
class CoordinatePlaneText extends ClassHelper {

    constructor(gl, shaderProgram, mvMatrix, config, textConfig) {
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
            ledge: 0.0,
            rotate: 0,
            xRotation: 0,
            yRotation: 0,
            zRotation: 0,
            text: {
                      text: '',            
                      size: 24,
                      font: 'Georgia',
                      color: '#000000',            
                      width: 0.3,
                      height: 0.3
            },
            textPosition: 'x'
        };
        this.mvMatrix = mvMatrix;
        super.loadConfig(config);
        this.webGLStart();
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
    
    getTextPosition() {
        return this.cfg.textPosition;
    }                  

    webGLStart() {
        let xTexture, yTexture; 
        let x = this.getX();
        let y = this.getY();
        let z = this.getZ();        
        let width = this.getWidth();
        let height = this.getHeight();
        let xTicksCount = this.getxTicksCount();
        let yTicksCount = this.getyTicksCount();
        let ledge = this.getLedge();
        let xlp = width / (xTicksCount - 1);
        let ylp = height / (yTicksCount - 1);
        let rotate = this.getRotate();
        let xRotation = this.getxRotation();
        let yRotation = this.getyRotation();
        let zRotation = this.getzRotation();
        let textWidth = this.getTextWidth();
        let textHeight = this.getTextHeight();
        let textSize = this.getTextSize();
        let textFont = this.getTextFont();
        let textColor = this.getTextColor(); 
        let posX = 0;
        let posY = 0;
        if (this.getTextPosition() == 'x') {
            posX = 1;
        } else {
            posY = 1;
        }
       
        mat4.rotate(this.mvMatrix, rotate, [xRotation, yRotation, zRotation]);
        const axisY = new CoordinatePlane(this.gl, this.shaderProgram, this.mvMatrix, {x: x, y: y, z: z, width: width, height: height, xTicksCount: xTicksCount, yTicksCount: yTicksCount, ledge: ledge});        
        for (let i = 0; i < posX * yTicksCount + posY * xTicksCount; i++) {
            xTexture = posX * (x + width + ledge) + posY * (x + i * xlp - textWidth / 2);
            yTexture = posX * (y + i * ylp - textHeight / 2) + posY * (y + height + ledge);            
            const char = new Character(this.gl, this.shaderProgram, this.mvMatrix, {x: xTexture, y: yTexture, z: z, text: {text: 'x' + i, size: textSize, font: textFont, color: textColor, width: textWidth, height: textHeight}});
        }        
    }

    div(val, by){
        return Math.trunc(val / by);
    }

    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }   
}


