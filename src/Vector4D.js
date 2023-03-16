import {
    construct_array,
    implementation,
    generate_vector_implementation,
    construct_vector_from,
    construct_vector_using,
    construct_vector_piecewise
} from './implementation.js';
import polymorphism, { internal } from './polymorphism.js';

const vector_size = 4;

export default class Vector4D {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this[internal] = Object.seal(construct_array([0, 0, 0, 1], [...arguments]));
    }

    static from(array, offset = 0) {
        return construct_vector_from(vector_size, array, offset);
    }

    static using(array, offset = 0) {
        return construct_vector_using(vector_size, array, offset);
    }

    static piecewise(...items) {
        return construct_vector_piecewise(vector_size, ...items);
    }

    * [Symbol.iterator]() {
        yield * this[internal];
    }

    /**
     * @returns {ThisType}
     */
    setZero() {
        implementation[this[polymorphism]].setZero(this);
        return this;
    }

    /**
     * @returns {ThisType}
     */
    setDefault() {
        implementation[this[polymorphism]].setDefault(this);
        return this;
    }

    set(x, y, z, w) {
        this.xyzw = [x, y, z, w];
        return this;
    }
}

const VectorClass = Vector4D;

VectorClass.prototype[polymorphism] = Symbol(`Vector${vector_size}D.polymorphism`);

generate_vector_implementation(vector_size, VectorClass);

Object.defineProperties(VectorClass.prototype, {
    size: {
        value: vector_size
    }
});