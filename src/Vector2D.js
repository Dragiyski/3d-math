import {
    construct_array,
    implementation,
    generate_vector_implementation,
    construct_vector_from,
    construct_vector_using,
    construct_vector_piecewise
} from './implementation.js';
import polymorphism, { internal } from './polymorphism.js';

const vector_size = 2;

export default class Vector2D {
    constructor(x = 0, y = 0) {
        this[internal] = Object.seal(construct_array([0, 0], [...arguments]));
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

    set(x, y) {
        this.xy = [x, y];
        return this;
    }
}

const VectorClass = Vector2D;

VectorClass.prototype[polymorphism] = Symbol(`Vector${vector_size}D.polymorphism`);

generate_vector_implementation(vector_size, VectorClass);

Object.defineProperties(VectorClass.prototype, {
    size: {
        value: vector_size
    }
});
