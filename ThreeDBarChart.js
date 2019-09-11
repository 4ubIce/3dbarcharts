class ThreeDBarChart {

    constructor(element, config, file) {
        this.element = element;
        this.cfg = {
            x: 0,
            y: 0,
            width: 600,
            height: 500,
            offset: 0,
            barColor: '#1f77b4',
            lineColor: 'red',
            margin: {top: 50, right: 50, bottom: 50, left: 50},
            barPadding: 0.1
        };
                    
        this.loadConfig(config);
        this.loadDataAndDraw(file);
        
    }
    
    getWidth() {
        return this.cfg.width;
    } 
    
    getHeight() {
        return this.cfg.height;
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
    
    loadDataAndDraw(file) {
        d3.csv(file)
          .then((d) => {this.draw(d);});
          //.catch((error) => {console.error('can not read file: ' + file + ' ' + new Error().stack);});        
    }    
    
    draw(data) {

        let w = this.getWidth();
        let h = this.getHeight();
        
        let gl = this.initGL(this.element);
        const yScale = d3.scaleLinear()
                       .domain([0, d3.max(data, function(d) {return +d.Value})])
                       .range([-1, 1]);
        if (gl) {
            for (var i = 0; i < data.length; i++) {
                const bar1 = new ThreeDBar(gl, {height: yScale(data[i].Value), offset: i / 2 - 2});
            };
        }                        
         
                               
    }
    
    initGL(canvas) {
        let gl;
        try {
            gl = canvas.getContext("webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);            
        } catch(e) {
        }
        if (!gl) {
           alert("Could not initialise WebGL, sorry :-(");
        }
        return gl;
    }     
}