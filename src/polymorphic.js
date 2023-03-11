export const math_polymorphism = Symbol('polymorphism');

// eslint-disable-next-line no-extend-native
export const number_polymophism = Number.prototype[math_polymorphism] = Symbol('Number.polymorphism');
// Extending prototype here is okay, it is a symbol, so it won't interfere with anything existing.

export const Vector2D_polymorphism = Symbol('Vector2D.polymorphism');
export const Vector3D_polymorphism = Symbol('Vector3D.polymorphism');
export const Vector4D_polymorphism = Symbol('Vector4D.polymorphism');
export const Matrix2x2_polymorphism = Symbol('Matrix2x2.polymorphism');
export const Matrix3x2_polymorphism = Symbol('Matrix3x2.polymorphism');
export const Matrix4x2_polymorphism = Symbol('Matrix4x2.polymorphism');
export const Matrix2x3_polymorphism = Symbol('Matrix2x3.polymorphism');
export const Matrix3x3_polymorphism = Symbol('Matrix3x3.polymorphism');
export const Matrix4x3_polymorphism = Symbol('Matrix4x3.polymorphism');
export const Matrix2x4_polymorphism = Symbol('Matrix2x4.polymorphism');
export const Matrix3x4_polymorphism = Symbol('Matrix3x4.polymorphism');
export const Matrix4x4_polymorphism = Symbol('Matrix4x4.polymorphism');

export const construct_from = Symbol('Array.from');
export const construct_at = Symbol('Array.at');
export const construct_piecewise_from = Symbol('Array.piecewise_from');
export const construct_piecewise_at = Symbol('Array.piecewise_at');

function array_from(size, index) {
    if (!Number.isSafeInteger(index) || !Number.isSafeInteger(size) || index < 0 || size < 0) {
        throw new TypeError('Invalid arguments');
    }
    if (index + size > this.length) {
        throw new RangeError(`Range [${index}; ${index + size}) out of bounds [0, ${this.length})`);
    }
    for (let i = 0; i < size; ++i) {
        if (typeof this[index + i] !== 'number') {
            throw new TypeError('Not a numeric array');
        }
    }
    const value = this.slice(index, size);
    return Object.seal(value);
}

function array_at(size, index) {
    if (!Number.isSafeInteger(index) || !Number.isSafeInteger(size) || index < 0 || size < 0) {
        throw new TypeError('Invalid arguments');
    }
    if (index + size > this.length) {
        throw new RangeError(`Range [${index}; ${index + size}) out of bounds [0; ${this.length})`);
    }
    for (let i = 0; i < size; ++i) {
        if (typeof this[index + i] !== 'number') {
            throw new TypeError('Not a numeric array');
        }
    }
    const ref = Object.create(Array.prototype);
    for (let i = 0; i < size; ++i) {
        Object.defineProperty(ref, i, {
            get: () => this[index + i],
            set: value => {
                if (typeof value !== 'number') {
                    throw new TypeError('Only numbers are allowed into numeric array');
                }
                this[index + i] = value;
            }
        });
    }
    Object.defineProperty(ref, 'length', {
        value: size
    });
    return Object.seal(ref);
}

function piecewise_from(size, ...index) {
    if (index.length !== size && !index.every(value => (Number.isSafeInteger(value) && value >= 0))) {
        throw new TypeError('Invalid arguments');
    }
    index.forEach(value => {
        if (value >= this.length) {
            throw new RangeError(`Index ${value} out of bounds [0; ${this.length})`);
        }
        if (typeof this[value] !== 'number') {
            throw new TypeError('Not a numeric array');
        }
    });
    const value = new Array(size);
    for (let i = 0; i < size; ++i) {
        value[i] = this[index[i]];
    }
    return Object.seal(value);
}

function piecewise_at(size, ...index) {
    if (index.length !== size && !index.every(value => (Number.isSafeInteger(value) && value >= 0))) {
        throw new TypeError('Invalid arguments');
    }
    index.forEach(value => {
        if (value >= this.length) {
            throw new RangeError(`Index ${value} out of bounds [0; ${this.length})`);
        }
        if (typeof this[value] !== 'number') {
            throw new TypeError('Not a numeric array');
        }
    });
    const ref = Object.create(Array.prototype);
    for (let i = 0; i < size; ++i) {
        Object.defineProperty(ref, i, {
            get: () => this[index[i]],
            set: value => {
                if (typeof value !== 'number') {
                    throw new TypeError('Only numbers are allowed into numeric array');
                }
                this[index[i]] = value;
            }
        });
    }
    Object.defineProperty(ref, 'length', {
        value: size
    });
    return Object.seal(ref);
}

for (const Class of [Array, Float32Array, Float64Array]) {
    Class.prototype[construct_from] = array_from;
    Class.prototype[construct_at] = array_at;
    Class.prototype[construct_piecewise_from] = piecewise_from;
    Class.prototype[construct_piecewise_at] = piecewise_at;
}
