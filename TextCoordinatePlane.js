class TextCoordinatePlane extends CoordinatePlane {
	constructor(gl, shaderProgram, mvMatrix, config) {
		super(gl, shaderProgram, mvMatrix, config);
	this.color = color;

	let t = this;
  t.setColor( t.color );

  t.draw();
  }

};
