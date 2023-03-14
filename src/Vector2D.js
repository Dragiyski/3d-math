import { construction } from './implementation.js';
import polymorphism from './polymorphism.js';

export default class Vector2D {
    #value;

    constructor(x = 0, y = 0) {
        this.#value = Object.seal([x, y]);
    }

    static from(array, ...args) {
        const self = Object.create(Vector2D.prototype);
        self.#value = construction[array[polymorphism]].vector_from_array(2, array, ...args);
        return self;
    }

    static using(array, ...args) {
        const self = Object.create(Vector2D.prototype);
        self.#value = construction[array[polymorphism]].vector_using_array(2, array, ...args);
        return self;
    }
}

Vector2D.prototype[polymorphism] = Symbol('Vector2D.polymorphism');
