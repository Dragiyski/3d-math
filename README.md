# 3d-math

A small 3D math library compatible with buffer implementation for WebGL/WebGPU.

This is a math library with vectors and matrices with 2-4 dimensions. This is not a tensor library that allow working with higher dimension vectors. However, the library allows control of the vector/matrix memory alignment and allow GLSL-like swizzling, allowing writing code in a similar way to GLSL shaders in JavaScript and test/debug algorithms.

## Installation

From source, library installation requires cloning this repository and running:

```
npm install --production
```

or alternatively just include the git version in your `package.json` for node packages.

For browser version the command above will generate files in `dist/` directory which can be added in web directory of your server.

## Debugging helpers

The file `formatter.js` (in the output directory `dist/`) might be imported directly:

```javascript
import 'formatter.js';
```

and check `Custom Formatters` in Chrome devtools or equivalent option in other browser debuggers.

The formatter preview the vector/matrix content as table on top of already existing object properties.

## Testing

For testing run:

```
npm test
```

For test coverage CI/CD execute:

```
npm run coverage
```

## Operations and types

The library have the following types in `math.js`:

```
Vector2D
Vector3D
Vector4D
Matrix2x2
Matrix2x3
Matrix2x4
Matrix3x2
Matrix3x3
Matrix3x4
Matrix4x2
Matrix4x3
Matrix4x4
```
### Vectors

The following operations are available for `Vector_D`:

```
.set(Vector)
.set(Number...)
```

Set the vector data by either from another vector or by set of coordinates.

```
.into(Vector)
```

Copy the current vector data into existing vector.

```
static .from(array_like, offset)
```

Create a new vector copying data from existing array.

```
static .using(array_like, offset)
```

Create a new vector referencing data from existing array.

```
static .piecewise(descriptor)
```

Create a new vector referencing data for each component individually. This allow referencing numbers in different locations for each element of the vector, including situation where the elements are not consecutive in memory.

### Matrices

The following operations are available for `Matrix_x_`:

```
static .from_rows(vectors...)
static .from_columns(vectors...)
```

Create a matrix by copying information from vectors/array-like iterable objects.

```
static .using_rows(vectors...)
static .using_columns(vectors...)
```

Create a matrix by referencing information from vectors/array-like iterable objects.

```
set_identity()
```

For square matrix where `rows.length === columns.length` set the data to identity matrix. That is set all elements to zero, except the element in the main diagonal which are set to one.

```
.rotation(radians, axis);
.translation(vector);
.scale(factors...);
.rotation_from_quaternions(x, y, z, w);
```

Apply multiplication of matrix by a rotation, translation or scaling matrix. For `Matrix3x3` and `Matrix4x4` rotation by quaternions is also possible.

### Functional operations

A set of functional polymorphic operations similar to GLSL builtins. Most operations are defined on `Number`, `Vector` and `Matrix` with specific sizes. The operations thrown a `TypeError` exception if called with incompatible arguments, like `dot` between vectors with different sizes or matrix multiplication with incompatible matrix sizes.

```
add(a, b)
sub(a, b)
mul(a, b)
div(a, b)
mod(a, b)
```

Math operator operations. The arguments can be `Number`, `Vector` or `Matrix`. For matrix, `mul` perform matrix multiplication (not a component-wise multiplication).

```
abs(x)
acos(x)
acosh(x)
asin(x)
asinh(x)
atan(x)
atanh(x)
cbrt(x)
ceil(x)
cos(x)
cosh(x)
exp(x)
expm1(x)
floor(x)
log(x)
log10(x)
log1p(x)
log2(x)
round(x)
sign(x)
sin(x)
sinh(x)
sqrt(x)
tan(x)
tanh(x)
trunc(x)
neg(x)
length(x)
normalize(x)
```

A math operations for a number of component-wise on a vector.

```
determinant(x)
inverse(x)
transpose(x)
```

A math operations for matrices.

```
cross(x, y)
dot(x, y)
```

A vector multiplications between two vectors.

```
hg_collapse(vector, divide=true)
hg_expand(vector, value=1)
```

Homogeneous expand and collapse of a vector. The `hg_collapse` exists only on `Vector3D` and `Vector4D` and return vector with one dimension less by dividing all dimensions by the last dimension. The `hg_expand` exists only on `Vector2D` and `Vector3D` by adding a new dimension containing 1.

```
radians_from(degrees);
degrees_from(radians);
```

Convert between degrees and radians.

## Float limits

The `limit.js` include automatic computation of floating points limits. It exposes 3 interfaces: `number`, `float32` and `float64`. The `number` is the native JavaScript floating point number (which should be identical to `float64`, but the limits should work for any size IEEE754 floating-point number), while `float32` and `float64` are useful for `Float32Array` and `Float64Array` views.

```
.minValue
```

Returns the smallest positive floating point number, it will be a denormal.

```
.maxValue
```

Returns the largest finite positive floating point number. Only the positive infinity is bigger than the number.

```
.minExponent
```

Returns the minimum exponent value.


```
.maxExponent
```

Return the maximum exponent value.

```
.fractionBits
```

Returns the number of fraction bits in the floating pointer number.

```
.epsilon
```

Returns the minimum relative error of the floating point number. That is the distance between value `1.0` and the next floating point representable value. The relative error scale up or down with the exponent.


```
.isEqual(a, b)
```

comapre floating point numbers and returns `true` if the numbers are bitwise identical, or if the difference between the number is smaller than their relative floating point error. Returns `false` otherwise. Always returns `false` for `NaN` even if both numbers are bitwise identical `NaN`.

When two numbers are different, but smaller than their floating-point relative error, it cannot be guaranteed if the operation created the numbers genuinely return different numbers or the difference is due to floating-point error. In the latter case `isEqual` will return `true` where the JavaScript's `===` operator will return `false`.
