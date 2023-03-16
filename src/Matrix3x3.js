import Reference from './Reference.js';
import { construct_array, vector_class_by_size } from './implementation.js';
import polymorphism, { internal } from './polymorphism.js';

const row_count = 3;
const column_count = 3;

const default_values = new Array(row_count * column_count).fill(0);
if (row_count === column_count) {
    for (let i = 0; i < row_count; ++i) {
        default_values[i * row_count + i] = 1;
    }
}

export default class Matrix3x3 {
    constructor() {
        const values = construct_array(
            default_values,
            [...arguments]
        );
        this[internal] = {
            rows: [],
            columns: []
        };
        for (let i = 0; i < row_count; ++i) {
            this[internal].rows.push(new vector_class_by_size[column_count](values.slice(i * column_count, i * column_count + column_count)));
        }
        for (let i = 0; i < column_count; ++i) {
            const refs = [];
            for (let j = 0; j < row_count; ++j) {
                refs.push(Reference(this[internal].rows[j], i));
            }
            this[internal].columns.push(vector_class_by_size[column_count].piecewise(...refs));
        }
        matrix_construct(this);
    }

    static from_rows(...vectors) {
        if (vectors.length !== row_count) {
            throw new TypeError(`Invalid number of arguments: expected ${row_count} vectors, got ${vectors.length}`);
        }
        for (let i = 0; i < vectors.length; ++i) {
            const vector = vectors[i];
            if (!(vector instanceof vector_class_by_size[column_count])) {
                throw new TypeError(`The vector at index [${i}] is not an instance of ${vector_class_by_size[column_count].name}`);
            }
        }
        const self = Object.create(MatrixClass.prototype);
        self[internal] = {
            rows: vectors.map(vector => new vector_class_by_size[column_count](vector)),
            columns: new Array(column_count)
        };
        for (let i = 0; i < column_count; ++i) {
            const refs = new Array(row_count);
            for (let j = 0; j < row_count; ++j) {
                refs[j] = Reference(self[internal].rows[j], i);
            }
            self[internal].columns[i] = vector_class_by_size[column_count].piecewise(...refs);
        }
        matrix_construct(self);
        return self;
    }

    static using_rows(...vectors) {
        if (vectors.length !== row_count) {
            throw new TypeError(`Invalid number of arguments: expected ${row_count} vectors, got ${vectors.length}`);
        }
        for (let i = 0; i < vectors.length; ++i) {
            const vector = vectors[i];
            if (!(vector instanceof vector_class_by_size[column_count])) {
                throw new TypeError(`The vector at index [${i}] is not an instance of ${vector_class_by_size[column_count].name}`);
            }
        }
        const self = Object.create(MatrixClass.prototype);
        self[internal] = {
            rows: vectors,
            columns: new Array(column_count)
        };
        for (let i = 0; i < column_count; ++i) {
            const refs = new Array(row_count);
            for (let j = 0; j < row_count; ++j) {
                refs[j] = Reference(self[internal].rows[j], i);
            }
            self[internal].columns[i] = vector_class_by_size[column_count].piecewise(...refs);
        }
        matrix_construct(self);
        return self;
    }

    static from_columns(...vectors) {
        if (vectors.length !== column_count) {
            throw new TypeError(`Invalid number of arguments: expected ${column_count} vectors, got ${vectors.length}`);
        }

        for (let i = 0; i < vectors.length; ++i) {
            const vector = vectors[i];
            if (!(vector instanceof vector_class_by_size[row_count])) {
                throw new TypeError(`The vector at index [${i}] is not an instance of ${vector_class_by_size[column_count].name}`);
            }
        }
        const self = Object.create(MatrixClass.prototype);
        self[internal] = {
            columns: vectors.map(vector => new vector_class_by_size[row_count](vector)),
            rows: new Array(row_count)
        };
        for (let i = 0; i < row_count; ++i) {
            const refs = new Array(column_count);
            for (let j = 0; j < column_count; ++j) {
                refs[j] = Reference(self[internal].columns[j], i);
            }
            self[internal].rows[i] = vector_class_by_size[column_count].piecewise(...refs);
        }
    }
}

function matrix_construct(self) {
    Object.defineProperties(self, {
        columns: {
            enumerable: true,
            value: Object.create(Array.prototype, {
                length: {
                    value: column_count
                }
            })
        },
        rows: {
            enumerable: true,
            value: Object.create(Array.prototype, {
                length: {
                    value: row_count
                }
            })
        }
    });
    for (let i = 0; i < column_count; ++i) {
        Object.defineProperty(self.columns, i, {
            enumerable: true,
            get: () => self[internal].columns[i],
            set: value => {
                self[internal].columns[i].set(...value);
            }
        });
    }
    for (let i = 0; i < row_count; ++i) {
        Object.defineProperty(self.rows, i, {
            enumerable: true,
            get: () => self[internal].rows[i],
            set: value => {
                self[internal].rows[i].set(...value);
            }
        });
    }
    Object.seal(self.columns);
    Object.seal(self.rows);
}

const MatrixClass = Matrix3x3;
