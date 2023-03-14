import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Code from './code.js';

const __file__ = fileURLToPath(import.meta.url);
const __dir__ = dirname(__file__);

export async function generate(output_dir) {
    await fs.promises.mkdir(output_dir, { recursive: true, mode: 0o755 });
}

const unaryOperatorMap = {
    neg: '-',
    inc: '++',
    dec: '--'
};

const binaryOperatorMap = {
    add: '+',
    sub: '-',
    mul: '*',
    div: '/',
    mod: '%',
    lt: '<',
    lte: '<=',
    gt: '>',
    gte: '>=',
    eq: '===',
    neq: '!=='
};

function createIndexModule() {
    const code = new Code();

    code.append(
        `import polymorphism from './polymorphism.js';`,
        `import * as implementation from './implementation.js';`,
        '',
        ...createUnaryOperators(),
        ...createBinaryOperators(),
        ...createPolymorphicFunction('abs', ['x']),
        ...createPolymorphicFunction('acos', ['x']),
        ...createPolymorphicFunction('acosh', ['x']),
        ...createPolymorphicFunction('asin', ['x']),
        ...createPolymorphicFunction('asinh', ['x']),
        ...createPolymorphicFunction('atan', ['x']),
        ...createPolymorphicFunction('atan2', ['x']),
        ...createPolymorphicFunction('atanh', ['x']),
        ...createPolymorphicFunction('ceil', ['x']),
        ...createPolymorphicFunction('clamp', ['x', 'min', 'max']),
        ...createPolymorphicFunction('cos', ['x']),
        ...createPolymorphicFunction('cosh', ['x']),
        ...createPolymorphicFunction('cross', ['x', 'y']),
        ...createPolymorphicFunction('degrees', ['x']),
        ...createPolymorphicFunction('determinant', ['m']),
        ...createPolymorphicFunction('distance', ['p0', 'p1']),
        ...createPolymorphicFunction('dot', ['x', 'y']),
        ...createPolymorphicFunction('nearly_equal', ['x', 'y']),
        ...createPolymorphicFunction('not_nearly_equal', ['x', 'y']),
        ...createPolymorphicFunction('exp', ['x']),
        ...createPolymorphicFunction('exp2', ['x']),
        ...createPolymorphicFunction('faceforward', ['N', 'I', 'Nref']),
        ...createPolymorphicFunction('floor', ['x']),
        ...createPolymorphicFunction('fract', ['x']),
        ...createPolymorphicFunction('inverse', ['m']),
        ...createPolymorphicFunction('length', ['x']),
        ...createPolymorphicFunction('log', ['x']),
        ...createPolymorphicFunction('log2', ['x']),
        ...createPolymorphicFunction('max', ['x', 'y']),
        ...createPolymorphicFunction('min', ['x', 'y']),
        ...createPolymorphicFunction('mix', ['x', 'y']),
        ...createPolymorphicFunction('normalize', ['v']),
        ...createPolymorphicFunction('outer_product', ['c', 'r']),
        ...createPolymorphicFunction('pow', ['x', 'y']),
        ...createPolymorphicFunction('radians', ['x']),
        ...createPolymorphicFunction('reflect', ['I', 'N']),
        ...createPolymorphicFunction('refract', ['I', 'N', 'eta']),
        ...createPolymorphicFunction('round', ['x']),
        ...createPolymorphicFunction('sign', ['x']),
        ...createPolymorphicFunction('sin', ['x']),
        ...createPolymorphicFunction('sinh', ['x']),
        ...createPolymorphicFunction('sqrt', ['x']),
        ...createPolymorphicFunction('tan', ['x']),
        ...createPolymorphicFunction('tanh', ['x']),
        ...createPolymorphicFunction('transpose', ['m'])
    );

    function createPolymorphicFunction(name, args) {
        return [
            `export function ${name}(${args.join(', ')}) {`,
            `  return implementation${args.map(to_path).join('')}.${name}(${args.join(', ')});`,
            '}',
            ''
        ];
        function to_path(arg) {
            return `[${arg}[polymorphism]]`;
        }
    }

    function createUnaryOperators() {
        return Object.keys(unaryOperatorMap).map(name => createPolymorphicFunction(name, ['x']));
    }

    function createBinaryOperators() {
        return Object.keys(binaryOperatorMap).map(name => createPolymorphicFunction(name, ['x', 'y']));
    }
}
