import polymorphism from './polymorphism.js';

export const implementation = {
    [Number.prototype[polymorphism]]: {
        [Number.prototype[polymorphism]]: {
            add(a, b) {
                return a + b;
            },
            sub(a, b) {
                return a - b;
            },
            mul(a, b) {
                return a * b;
            },
            div(a, b) {
                return a / b;
            },
            mod(a, b) {
                return a % b;
            }
        }
    }
};

export const construction = {
    [Array.prototype[polymorphism]]: {
        vector_from_array(size, array, offset = 0) {
            if (!Number.isSafeInteger(offset)) {
                throw new TypeError(`Invalid argument [offset]: not an index`);
            }
            if (offset < 0 || offset + size > array.length) {
                throw new RangeError(`Index out of bounds: [${offset}; ${offset + size}) not in range [0, ${array.length})`);
            }
            const value = array.slice(offset, offset + size);
            return value;
        },
        vector_using_array: create_vector_using_array()
    },
    [Float32Array.prototype[polymorphism]]: {
        vector_from_array: create_view_vector_from_array(Float32Array),
        vector_using_array: create_vector_using_array()
    },
    [Float64Array.prototype[polymorphism]]: {
        vector_from_array: create_view_vector_from_array(Float64Array),
        vector_using_array: create_vector_using_array()
    }
};

function create_view_vector_from_array() {
    return function vector_from_array(size, array, offset = 0) {
        if (!Number.isSafeInteger(offset)) {
            throw new TypeError(`Invalid argument [offset]: not an index`);
        }
        if (offset < 0 || offset + size > array.length) {
            throw new RangeError(`Index out of bounds: [${offset}; ${offset + size}) not in range [0, ${array.length})`);
        }
        const value = new Array(size);
        for (let i = 0; i < size; ++i) {
            value[i] = array[offset + i];
        }
        return value;
    };
}

function create_vector_using_array() {
    return function vector_using_array(size, array, offset = 0) {
        if (!Number.isSafeInteger(offset)) {
            throw new TypeError(`Invalid argument [offset]: not an index`);
        }
        if (offset < 0 || offset + size > array.length) {
            throw new RangeError(`Index out of bounds: [${offset}; ${offset + size}) not in range [0, ${array.length})`);
        }
        const value = Object.create(Array.prototype);
        Object.defineProperty(value, 'length', {
            value: size
        });
        for (let i = 0; i < size; ++i) {
            Object.defineProperty(value, i, {
                enumerable: true,
                get: () => array[offset + i],
                set: value => {
                    array[offset + i] = value;
                }
            });
        }
        return value;
    };
}
