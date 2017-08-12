/*
 * @file Represents a stack of 3x2 row-major matrices that look like this:
 *
 * |a b c|
 * |d f g|
 *
 * ... in object-oriented style.
 *
 * @author clabe45
 */

/**
 * Creates a new MatrixStack instance. If context is provided, then it will be bound to the matrix stack, and all transformations done
 * to the current matrix will be applied to this context. Otherwise, [applyToContext]{@link MatrixStack#applyToContext(m)} must be called
 * manually to apply the current matrix to a context.
 * @param {CanvasRenderingContext2D} [context]
 * @class
 */
function MatrixStack(context) {
	this.loadIdentity();
  if (context) this.context = context;
}
/**
 * Multiplies current matrix by m, and overwrites current matrix slot
 * @param {Number[]} matrix
 */
MatrixStack.prototype.multMatrix = function(matrix) {
  var m = matrix;
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
  if (this.context) this.applyToContext(this.context);  // apply to context automatically, if context bound
};
/**
 * Copies the current matrix, and pushes it onto the stack for transformation.
 */
MatrixStack.prototype.pushMatrix = function() {
	var copy = this.current.slice();
	this.stack.push(copy);	// copy current matrix and push it onto the stack
	this.current = copy;
};
/**
 * Removes the current matrix from the stack.
 */
MatrixStack.prototype.popMatrix = function() {
	if (this.stack.length > 0) this.stack.pop();
	this.current = this.stack[this.stack.length-1];
};
/**
 * Clears the stack of all matrices and then pushes the identity matrix onto it
 */
MatrixStack.prototype.loadIdentity = function() {
	var identity = [	// identity matrix
  	1, 0, 0,
    0, 1, 0
  ];
  this.stack = [identity];
  this.current = identity;
}
/**
 * Multiplies the current matrix by a new translation matrix, constructed with the given arguments
 * @param {Number} x
 * @param {Number} y
 */
MatrixStack.prototype.translate = function(x, y) {
	var matrix = [	//translation matrix
		1, 0, x,
		0, 1, y
	];
	this.multMatrix(matrix);
}
/**
 * Multiples the current matrix by a new scale matrix, constructed with the given arguments
 * @param {Number} x
 * @param {Number} y
 */
MatrixStack.prototype.scale = function(x, y) {
	var matrix = [
		x, 0, 0,
		0, y, 0
	];
	this.multMatrix(matrix);
};
/**
 * Multiplies the current matrix by a new rotation matrix, constructed with the given argument
 * @param {Number} r the rotation expressed in radians
 */
MatrixStack.prototype.rotate = function(r) {
	var matrix = [
		  Math.cos(r), Math.sin(r), 0,
	     -Math.sin(r), Math.cos(r), 0
	];
  this.multMatrix(matrix);
};
/**
 * Binds this matrix stack to a CanvasRenderingContext2D instances. If already bound, replaces currently-bound context. Now all
 * transformations will be applied to this context.
 * @param {CanvasRenderingContext2D} context the new context to be bound to
 */
MatrixStack.prototype.bindToContext = function(context) {
  this.context = context;
}
/**
 * If this matrix stack is not bound to a CanvasRenderingContext2D instance, calls setTransform on context with the current matrix
 * @param {CanvasRenderingContext2D} context the context to apply the current matrix to
 */
MatrixStack.prototype.applyToContext = function(context) {
	var c = this.current;
	context.setTransform(c[0], c[3], c[1], c[4], c[2], c[5]);	// switch to column-major
};
