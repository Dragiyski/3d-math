import Code from "./code.js";

const vector_argument_values = {
    x: 0,
    y: 0,
    z: 0,
    w: 1
};

const vector_arguments = ['x', 'y', 'z', 'w'];

function createVector(size) {
    const code = new Code();
    return [
        `export class Vector${size}D {`,
        ...createVectorConstructor(size),
        '',
        ...createVectorStaticConstructor('from', size),
        ...createVectorStaticConstructor('using', size),
        `}`
    ];



    function createVectorConstructor(size) {
        const args = vector_arguments.slice(0, size);
        return [
            `constructor(${createArguments()}) {`,
            `  this.#value = new Array(${size})`,
            ...initArguments(),
            '}'
        ];

        function createArguments() {
            const argList = [];
            for (const arg of args) {
                argList.push(`${arg} = ${vector_argument_values[arg]}`);
            }
            return argList.join(', ');
        }

        function initArguments() {
            const lines = [];
            for (let i = 0; i < size; ++i) {
                lines.push(`this.#value[${i}] = ${args[i]};`);
            }
            return lines;
        }
    }
}

function createVectorStaticConstructor(name, size) {
    return [
        `static ${name}(object, ...args) {`,
        `  const self = Object.create(Vector${size}D.prototype);`,
        `  self.#value = object[polymorphic.Vector${size}D_polymorphism].${name}(${size}, ...args);`,
        '  return self;',
        '}'
    ];
}
