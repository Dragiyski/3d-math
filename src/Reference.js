const ReferenceClass = class Reference {
    #array;
    #offset;
    constructor(array, offset = 0) {
        if (!Number.isSafeInteger(offset) || offset < 0) {
            throw new TypeError('Invalid offset: must be value index');
        }
        if (!(array === Object(array) && typeof array[Symbol.iterator] === 'function' && 'length' in array && Number.isSafeInteger(array.length))) {
            throw new TypeError('Expected array to be an array-like object');
        }
        if (offset >= array.length) {
            throw new RangeError(`Index ${offset} out of bounds [0; ${array.length})`);
        }
        if (!(offset in array)) {
            throw new TypeError(`Sparse array detected: the offset ${offset} is in the array length, but not present`);
        }
        this.#array = array;
        this.#offset = offset;
    }

    get array() {
        return this.#array;
    }

    get offset() {
        return this.#offset;
    }

    get() {
        return this.#array[this.#offset];
    }

    set(value) {
        this.#array[this.#offset] = value;
    }
};

export default function Reference(...args) {
    return new ReferenceClass(...args);
}
