class CoordinatePlaneText {

    constructor(gl, shaderProgram, mvMatrix, config, textConfig) {
        //let coordinatePlane = super(gl, shaderProgram, mvMatrix, config);
        //console.log(coordinatePlane);
        //this.coordinatePlane = coordinatePlane;
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
            textWidth: 0.3,
            textHeight: 0.3
        };
        this.mvMatrix = mvMatrix;
        this.loadConfig(config);
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
    
    getTextWidth() {
        return this.cfg.textWidth;
    } 

    getTextHeight() {
        return this.cfg.textHeight;
    }             
       
    loadConfig(config) {
        if ('undefined' !== typeof config) {
            for (let i in config) {
                if ('undefined' !== typeof config[i]) {
                    this.cfg[i] = config[i];
                }
            }
        }    
    }     

    webGLStart() { 
        let x = this.getX();
        let y = this.getY();
        let z = this.getZ();        
        let width = this.getWidth();
        let height = this.getHeight();
        let xTicksCount = this.getxTicksCount();
        let yTicksCount = this.getyTicksCount();
        let ledge = this.getLedge();
        let xlp = width / xTicksCount;
        let ylp = height / (yTicksCount - 1);
        let rotate = this.getRotate();
        let xRotation = this.getxRotation();
        let yRotation = this.getyRotation();
        let zRotation = this.getzRotation();
        let textWidth = this.getTextWidth();
        let textHeight = this.getTextHeight();        
        mat4.rotate(this.mvMatrix, rotate, [xRotation, yRotation, zRotation]);
        const axisY = new CoordinatePlane(this.gl, this.shaderProgram, this.mvMatrix, {x: x, y: y, z: z, width: width, height: height, xTicksCount: xTicksCount, yTicksCount: yTicksCount, ledge: ledge});        
        for (let i = 0; i < yTicksCount; i++) {
            const bar11 = new Character(this.gl, this.shaderProgram, this.mvMatrix, {x: x + width + ledge, y: y + i * ylp - textHeight / 2, z: z, width: textWidth, height: textHeight, text: 'x' + i, textSize: 24});
        }        
    }

    div(val, by){
        return Math.trunc(val / by);
    }

    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }   
}


