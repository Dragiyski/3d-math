import { describe, it } from 'mocha';
import assert from 'node:assert';
import * as math from '../dist/math.js';

for (let dim = 2; dim <= 4; ++dim) {
    describe(`Vector${dim}D`, function () {
        it('should construct with default values', function () {
            let vector1, vector2;
            assert(typeof math[`Vector${dim}D`] === 'function', `typeof math.Vector${dim}D' === 'function'`);
            assert(typeof math.Vector?.[dim] === 'function', `typeof math.Vector[${dim}]' === 'function'`);
            assert(math[`Vector${dim}D`] === math.Vector?.[dim], `math.Vector${dim}D === math.Vector[${dim}]`);
            assert.doesNotThrow(() => {
                vector1 = new math[`Vector${dim}D`]();
                vector2 = new math.Vector[dim]();
            }, 'new math.Vector2D()');
            assert(vector1 instanceof math[`Vector${dim}D`], `vector instanceof math.Vector${dim}D`);
            assert(vector2 instanceof math.Vector[dim], `vector instanceof math.Vector[${dim}]`);
            assert.strictEqual(vector1[0], 0, 'vector1[0] === 0');
            assert.strictEqual(vector1[1], 0, 'vector1[1] === 0');
            if (dim >= 3) {
                assert.strictEqual(vector1[2], 0, 'vector1[2] === 0');
            }
            if (dim >= 4) {
                assert.strictEqual(vector1[3], 1, 'vector1[3] === 1');
            }
        });
        it('should copy construct from another vector', function () {
            const sv2 = new math.Vector2D(2, 3);
            const sv3 = new math.Vector3D(5, 7, 11);
            const sv4 = new math.Vector4D(13, 17, 19, 23);
            let dv2, dv3, dv4;
            assert.doesNotThrow(() => {
                dv2 = new math.Vector[dim](sv2);
            }, `new Vector${dim}D(Vector2D)`);
            assert.doesNotThrow(() => {
                dv3 = new math.Vector[dim](sv3);
            }, `new Vector${dim}D(Vector3D)`);
            assert.doesNotThrow(() => {
                dv4 = new math.Vector[dim](sv4);
            }, `new Vector${dim}D(Vector4D)`);
            assert(dv2 instanceof math.Vector[dim], `dv2 instanceof Vector${dim}D`);
            assert.strictEqual(dv2[0], sv2[0], `dv2[0] === sv2[0]`);
            assert.strictEqual(dv2[1], sv2[1], `dv2[1] === sv2[1]`);
            assert.strictEqual(dv3[0], sv3[0], `dv3[0] === sv3[0]`);
            assert.strictEqual(dv3[1], sv3[1], `dv3[1] === sv3[1]`);
            assert.strictEqual(dv4[0], sv4[0], `dv4[0] === sv4[0]`);
            assert.strictEqual(dv4[1], sv4[1], `dv4[1] === sv4[1]`);
            if (dim >= 3) {
                assert.strictEqual(dv2[2], 0, `dv2[2] === 0`);
                assert.strictEqual(dv3[2], sv3[2], `dv3[2] === sv3[2]`);
                assert.strictEqual(dv4[2], sv4[2], `dv4[2] === sv4[2]`);
            }
            if (dim >= 4) {
                assert.strictEqual(dv2[3], 1, `dv2[3] === 1`);
                assert.strictEqual(dv3[3], 1, `dv3[3] === 1`);
                assert.strictEqual(dv4[3], sv4[3], `dv4[3] === sv4[3]`);
            }
        });
        it('should construct from number', function () {
            let vector;
            assert.doesNotThrow(() => {
                vector = new math.Vector[dim](5);
            }, `new Vector${dim}D(5)`);
            for (let d = 0; d < dim; ++d) {
                assert.strictEqual(vector[d], 5, `vector[${d}] === 5`);
            }
        });
    });
}
