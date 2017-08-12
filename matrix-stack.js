/*
 * Represents a stack of 3x2 row-major matrices (that can be applied to a 2-long vector (x, y))
 * |a b c|
 * |d f g|
 */
function MatrixStack() {
	this.loadIdentity();
}
MatrixStack.prototype.multMatrix = function(m) {
	var c = this.current;
	var r = new Array(6);	// result
  c.push(0, 0, 1);  // final row
  m.push(0, 0, 1);
	for (var row=0; row<2; row++) {
		for (var col=0; col<3; col++) {
    	var sum = 0;
			for (var i=0; i<3; i++) {
      	sum += c[3*row+i] * m[3*i+col];
      }
      r[3*row+col] = sum;
		}
	}
	this.stack[this.stack.length-1] = r;	// set current matrix
  this.current = r;
};
MatrixStack.prototype.pushMatrix = function(m) {
	var copy = this.current.slice();
	this.stack.push(copy);	// copy current matrix and push it onto the stack
	this.current = copy;
};
MatrixStack.prototype.popMatrix = function() {
	if (this.stack.length > 0) this.stack.pop();
	this.current = this.stack[this.stack.length-1];
};
MatrixStack.prototype.loadIdentity = function() {
	var identity = [	// identity matrix
  	1, 0, 0,
    0, 1, 0
//     0, 0, 1
  ];
  this.stack = [identity];
  this.current = identity;
}
MatrixStack.prototype.translate = function(x, y) {
	var matrix = [	//translation matrix
		1, 0, x,
		0, 1, y
// 		0, 0, 1
	];
	this.multMatrix(matrix);
}
MatrixStack.prototype.scale = function(x, y) {
	var matrix = [
		x, 0, 0,
		0, y, 0
//     0, 0, 1
	];
	this.multMatrix(matrix);
};
MatrixStack.prototype.rotate = function(r) {
	var matrix = [
		  Math.cos(r), Math.sin(r), 0,
	     -Math.sin(r), Math.cos(r), 0
//           0,           0,           1
	];
  this.multMatrix(matrix);
};
MatrixStack.prototype.applyToContext = function(context) {
	var c = this.current;
	context.setTransform(c[0], c[3], c[1], c[4], c[2], c[5]);	// switch to column-major
};