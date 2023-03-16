import polymorphism, { internal } from './polymorphism.js';
import Code from './code.js';
import Reference from './Reference.js';

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

export function construct_array(default_value, args) {
    const values = [];
    scanArray(args);
    while (values.length < default_value.length) {
        values[values.length] = default_value[values.length];
    }
    return values;

    function scanArray(array, ...path) {
        for (const value of array) {
            if (value === Object(value) && typeof value[Symbol.iterator] === 'function') {
                if (path.indexOf(value) >= 0) {
                    throw new TypeError('Recursive argument in constructing array');
                }
                if (scanArray(value, array, ...path)) {
                    return true;
                }
            } else if (typeof value === 'number') {
                values.push(value);
                if (values.length >= default_value.length) {
                    return true;
                }
            } else {
                throw new TypeError('Expected either a recursive iterables of numbers or a number');
            }
        }
        return false;
    }
}

export function construct_vector_from(vector_size, array, offset = 0) {
    if (!Number.isSafeInteger(offset)) {
        throw new TypeError(`Invalid argument [offset]: not an index`);
    }
    if (offset < 0 || offset + vector_size > array.length) {
        throw new RangeError(`Index out of bounds: [${offset}; ${offset + vector_size}) not in range [0, ${array.length})`);
    }
    const self = Object.create(vector_class_by_size[vector_size].prototype);
    self[internal] = new Array(vector_size);
    for (let i = 0; i < vector_size; ++i) {
        self[internal][i] = array[offset + i];
        if (typeof self[internal][i] !== 'number') {
            throw new TypeError(`Invalid array item[${i}]: not a numeric value`);
        }
    }
    Object.seal(self[internal]);
    return self;
}

export function construct_vector_using(vector_size, array, offset = 0) {
    if (!Number.isSafeInteger(offset)) {
        throw new TypeError(`Invalid argument [offset]: not an index`);
    }
    if (offset < 0 || offset + vector_size > array.length) {
        throw new RangeError(`Index out of bounds: [${offset}; ${offset + vector_size}) not in range [0, ${array.length})`);
    }
    const self = Object.create(vector_class_by_size[vector_size].prototype);
    self[internal] = Object.create(Array.prototype);
    Object.defineProperty(self[internal], 'length', {
        value: vector_size
    });
    for (let i = 0; i < vector_size; ++i) {
        Object.defineProperty(self[internal], i, {
            enumerable: true,
            get: () => array[offset + i],
            set: value => {
                if (typeof value !== 'number') {
                    throw new TypeError(`Cannot set item[${i}] to a non-numeric value`);
                }
                array[offset + i] = value;
            }
        });
    }
    Object.seal(self[internal]);
    return self;
}

export function construct_vector_piecewise(vector_size, ...items) {
    if (items.length !== vector_size) {
        throw new TypeError('Invalid number of arguments');
    }
    const array = Object.create(Array.prototype);
    Object.defineProperty(array, 'length', {
        value: vector_size
    });
    for (let i = 0; i < vector_size; ++i) {
        const item = items[i];
        if (item !== Object(item)) {
            if (typeof item === 'number') {
                array[i] = item[i];
                continue;
            }
            throw new TypeError(`Invalid arguments[${i}]: expected a number or an object`);
        } else if (item instanceof Reference) {
            Object.defineProperty(array, i, {
                enumerable: true,
                get: item.get.bind(item),
                set: item.set.bind(item)
            });
        }
    }
    const self = Object.create(vector_class_by_size[vector_size].prototype);
    self[internal] = Object.seal(array);
    return self;
}

export const vector_class_by_size = Object.create(null);
const vector_dim_names = ['x', 'y', 'z', 'w'];
const vector_color_names = ['r', 'g', 'b', 'a'];
const vector_default_values = [0, 0, 0, 1];

function * permutateNameLetterFrom(list, size, prefix) {
    if (prefix.length >= size) {
        if (prefix.length > 0) {
            yield prefix;
        }
        return;
    }
    for (const letter of list) {
        yield * permutateNameLetterFrom(list, size, prefix + letter);
    }
}

function * permutateNameFrom(list, size) {
    yield * permutateNameLetterFrom(list, size, '');
}

function make_vector_vector_binary_operator(size, name, op) {
    const code = new Code();
    code.append(`return function ${name}(x, y) {`);
    code.append(`return new Vector[size](`);
    for (let i = 0; i < size; ++i) {
        code.append(`x[internal][${i}] ${op} y[internal][${i}]${i < size - 1 ? ',' : ''}`);
    }
    code.append(');', '};');
    return (new Function('Vector', 'size', 'internal', code.toString()))(vector_class_by_size, size, internal);
}

function make_number_vector_binary_operator(size, name, op) {
    const code = new Code();
    code.append(`return function ${name}(n, x) {`);
    code.append(`return new Vector[size](`);
    for (let i = 0; i < size; ++i) {
        code.append(`n ${op} x[internal][${i}]${i < size - 1 ? ',' : ''}`);
    }
    code.append(');', '};');
    return (new Function('Vector', 'size', 'internal', code.toString()))(vector_class_by_size, size, internal);
}

function make_vector_number_binary_operator(size, name, op) {
    const code = new Code();
    code.append(`return function ${name}(x, n) {`);
    code.append(`return new Vector[size](`);
    for (let i = 0; i < size; ++i) {
        code.append(`x[internal][${i}] ${op} n${i < size - 1 ? ',' : ''}`);
    }
    code.append(');', '};');
    return (new Function('Vector', 'size', 'internal', code.toString()))(vector_class_by_size, size, internal);
}

function make_vector_unary_operator(size, name, op) {
    const code = new Code();
    code.append(`return function ${name}(x) {`);
    code.append(`return new Vector[size](`);
    for (let i = 0; i < size; ++i) {
        code.append(`${op}x[internal][${i}]`);
    }
    code.append(');', '};');
    return (new Function('Vector', 'size', 'internal', code.toString()))(vector_class_by_size, size, internal);
}

function make_vector_dot(size) {
    const code = new Code();
    code.append(`return function dot(x, y) {`);
    code.append(`return ${multiply().join(' + ')};`);
    code.append('};');
    return (new Function('internal', code.toString()))(internal);

    function multiply() {
        const items = new Array(size);
        for (let i = 0; i < size; ++i) {
            items[i] = `x[internal][${i}] * y[internal][${i}]`;
        }
        return items;
    }
}

function define_swizzle(vector_size, name, indices) {
    const target_size = indices.length;
    Object.defineProperty(vector_class_by_size[vector_size].prototype, name, {
        get: (indices.length > 1 ? createVectorGetter : createNumberGetter)(),
        set: (indices.length > 1 ? createVectorSetter : createNumberSetter)()
    });

    function createVectorGetter() {
        const code = new Code();
        code.append('return function() {');
        code.append('return new Vector[size](' + indices.map(index => `this[internal][${index}]`).join(', ') + ');');
        code.append('};');
        return (new Function('Vector', 'size', 'internal', code.toString()))(vector_class_by_size, target_size, internal);
    }

    function createNumberGetter() {
        const code = new Code();
        code.append('return function() {');
        code.append(`return this[internal][${indices[0]}]`);
        code.append('};');
        return (new Function('internal', code.toString()))(internal);
    }

    function createVectorSetter() {
        const code = new Code();
        code.append('return function(value) {');
        for (let i = 0; i < indices.length; ++i) {
            const index = indices[i];
            code.append(`this[internal][${index}] = validateNumber(value?.[${i}], ${i});`);
        }
        code.append('};');
        return (new Function('internal', 'validateNumber', code.toString()))(internal, validateIndex);
    }

    function createNumberSetter() {
        const code = new Code();
        code.append('return function(value) {');
        code.append(`this[internal][${indices[0]}] = validateNumber(value);`);
        code.append('};');
        return (new Function('internal', 'validateNumber', code.toString()))(internal, validateNumber);
    }

    function validateIndex(value, index) {
        if (typeof value !== 'number') {
            throw new TypeError(`The value at item[${index}] is not a number`);
        }
        return value;
    }

    function validateNumber(value) {
        if (typeof value !== 'number') {
            throw new TypeError(`The value is not a number`);
        }
        return value;
    }
}

/**
 * @param {number} vector_size
 * @param {Function} VectorClass
 */
export function generate_vector_implementation(vector_size, VectorClass) {
    vector_class_by_size[vector_size] = VectorClass;
    for (let i = 0; i < vector_size; ++i) {
        Object.defineProperty(VectorClass.prototype, i, {
            enumerable: true,
            get() {
                return this[internal][i];
            },
            set(value) {
                if (typeof value !== 'number') {
                    throw new TypeError(`Cannot set item[${i}] to a non-numeric value`);
                }
                this[internal][i] = value;
            }
        });
    }

    for (const naming_scheme of [vector_dim_names, vector_color_names]) {
        const names = naming_scheme.slice(0, vector_size);
        const indexNames = Object.create(null);
        for (let i = 0; i < names.length; ++i) {
            indexNames[names[i]] = i;
        }
        for (let name_size = 1; name_size <= 4; ++name_size) {
            for (const name of permutateNameFrom(names, name_size)) {
                define_swizzle(vector_size, name, name.split('').map(k => indexNames[k]));
            }
        }
    }

    implementation[VectorClass.prototype[polymorphism]] = {
        [VectorClass.prototype[polymorphism]]: {
            add: make_vector_vector_binary_operator(vector_size, 'add', '+'),
            sub: make_vector_vector_binary_operator(vector_size, 'sub', '-'),
            mul: make_vector_vector_binary_operator(vector_size, 'mul', '*'),
            div: make_vector_vector_binary_operator(vector_size, 'div', '/'),
            mod: make_vector_vector_binary_operator(vector_size, 'mod', '%'),
            dot: make_vector_dot(vector_size)
        },
        [Number.prototype[polymorphism]]: {
            add: make_vector_number_binary_operator(vector_size, 'add', '+'),
            sub: make_vector_number_binary_operator(vector_size, 'sub', '-'),
            mul: make_vector_number_binary_operator(vector_size, 'mul', '*'),
            div: make_vector_number_binary_operator(vector_size, 'div', '/'),
            mod: make_vector_number_binary_operator(vector_size, 'mod', '%')
        },
        neg: make_vector_unary_operator(vector_size, 'neg', '-'),
        setZero(self) {
            for (let i = 0; i < vector_size; ++i) {
                self[internal][i] = 0;
            }
        },
        setDefault(self) {
            for (let i = 0; i < vector_size; ++i) {
                self[internal][i] = vector_default_values[i] ?? 0;
            }
        }
    };
    implementation[Number.prototype[polymorphism]][VectorClass.prototype[polymorphism]] = {
        add: make_number_vector_binary_operator(vector_size, 'add', '+'),
        sub: make_number_vector_binary_operator(vector_size, 'sub', '-'),
        mul: make_number_vector_binary_operator(vector_size, 'mul', '*'),
        div: make_number_vector_binary_operator(vector_size, 'div', '/'),
        mod: make_number_vector_binary_operator(vector_size, 'mod', '%')
    };
};
