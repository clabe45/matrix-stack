# matrix-stack
A simple 2D matrix library intended for canvas-rendering in JavaScript.

## Basic Syntax

```var transformations = new MatrixStack();```

_or_

```var transformations = new MatrixStack(ctx);	// this will bind ctx to transformations```

## Example Usage

```
...
var ctx = canvas.getContext('2d');
var stack = new MatrixStack(ctx);
stack.rotate(Math.PI/4);
ctx.strokeRect(0, 0, 20, 30);
```

Or if you prefer not to bind a context to your matrix stack so directly

```
...
var ctx = canvas.getContext('2d');
var stack = new MatrixStack();
stack.rotate(Math.PI/4);
stack.applyToContext(ctx);
ctx.strokeRect(0, 0, 20, 30);
```
