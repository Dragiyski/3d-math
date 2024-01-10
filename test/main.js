import { suite, test } from 'mocha';
import assert from 'node:assert';
import * as math from '../dist/math.js';
import { permutateNameFrom, vector_color_names, vector_dim_names, vector_name_index } from '../src/name-permutation.js';

for (let dim = 2; dim <= 4; ++dim) {
    suite(`Vector${dim}D`, function () {
        test('.constructor()', function () {
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
        test('.constructor(VectorND)', function () {
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
                const sv2_1 = new math.Vector2D(8, 9);
                let sv2sv2;
                assert.doesNotThrow(() => {
                    sv2sv2 = new math.Vector4D(sv2, sv2_1);
                }, `new Vector4D(Vector2D, Vector2D)`);
                assert.strictEqual(sv2sv2[0], sv2[0]);
                assert.strictEqual(sv2sv2[1], sv2[1]);
                assert.strictEqual(sv2sv2[2], sv2_1[0]);
                assert.strictEqual(sv2sv2[3], sv2_1[1]);
            }
        });
        test('.constructor(Number)', function () {
            let vector;
            assert.doesNotThrow(() => {
                vector = new math.Vector[dim](5);
            }, `new Vector${dim}D(5)`);
            for (let d = 0; d < dim; ++d) {
                assert.strictEqual(vector[d], 5, `vector[${d}] === 5`);
            }
        });
        test('.constructor(recursive Array)', function () {
            const recursive_args = [3.4, null];
            {
                const ra = [recursive_args];
                recursive_args[1] = ra;
            }
            let recursive_vector;
            assert.doesNotThrow(() => {
                recursive_vector = new math.Vector[dim](recursive_args);
            });
            for (let d = 0; d < dim; ++d) {
                assert.strictEqual(recursive_vector[d], recursive_args[0], `vector[${d}] === 5`);
            }
        });
        test('.from(TypedArray)', function () {
            const array = new Float32Array(new ArrayBuffer(64 * 4));
            const ref = new Float32Array(new ArrayBuffer(64 * 4));
            for (let i = 0; i < array.length; ++i) {
                ref[i] = array[i] = Math.pow(i + 1, 2) / 3;
            }
            const vector = {};
            assert.doesNotThrow(() => {
                vector[0] = math.Vector[dim].from(array);
                vector[7] = math.Vector[dim].from(array, 7);
                vector[16] = math.Vector[dim].from(array, 16);
            }, `new Vector${dim}D.from([object Array], [number])`);
            for (const o of [0, 7, 16]) {
                for (let d = 0; d < dim; ++d) {
                    assert.strictEqual(vector[o][d], array[o + d], `vector[${o}][${d}] === array[${o + d}]`);
                }
            }
            for (const o of [0, 7, 16]) {
                for (let d = 0; d < dim; ++d) {
                    vector[o][d] += 1 / 4;
                }
            }
            for (let i = 0; i < array.length; ++i) {
                assert.strictEqual(array[i], ref[i], `array[${i}] not modified`);
            }
        });
        test('.using(TypedArray)', function () {
            const array = new Float32Array(new ArrayBuffer(64 * 4));
            const ref = new Float32Array(new ArrayBuffer(64 * 4));
            for (let i = 0; i < array.length; ++i) {
                ref[i] = array[i] = Math.pow(i + 1, 2) / 3;
            }
            const vector = {};
            assert.doesNotThrow(() => {
                vector[0] = math.Vector[dim].using(array);
                vector[7] = math.Vector[dim].using(array, 7);
                vector[16] = math.Vector[dim].using(array, 16);
            }, `new Vector${dim}D.using([object Array], [number])`);
            for (const o of [0, 7, 16]) {
                for (let d = 0; d < dim; ++d) {
                    assert.strictEqual(vector[o][d], array[o + d], `vector[${o}][${d}] === array[${o + d}]`);
                }
            }
            for (const o of [0, 7, 16]) {
                for (let d = 0; d < dim; ++d) {
                    vector[o][d] += 1 / 4;
                    ref[o + d] += 1 / 4;
                }
            }
            for (let i = 0; i < array.length; ++i) {
                assert.strictEqual(array[i], ref[i], `array[${i}] not modified`);
            }
            for (let i = 0; i < array.length; ++i) {
                assert.strictEqual(array[i], ref[i], `array[${i}] not modified`);
            }
        });
        test('.piecewise(Reference<Array>, Reference<TypedArray>, Reference<Object property>, Number)', function () {
            const source = [
                [4.5, 5.2],
                Float32Array.from([7.1, 6.9]),
                { foo: 1.4 },
                9.2
            ];
            const ref = [
                [4.5, 5.2],
                Float32Array.from([7.1, 6.9]),
                { foo: 1.4 },
                9.2
            ];
            const make_comb_of = (comb, count) => {
                if (comb.length >= count) {
                    return [comb];
                }
                const highest = Math.max(-1, ...comb);
                const res = [];
                for (let i = highest + 1; i < 4; ++i) {
                    res.push(...make_comb_of([...comb, i], count));
                }
                return res;
            };
            const c = make_comb_of([], dim);
            const s = [
                c.map(e => e.map(i => {
                    if (i <= 1) {
                        return [source[i]];
                    } else if (i === 2) {
                        return [source[i], 'foo'];
                    } else {
                        return source[i];
                    }
                })),
                c.map(e => e.map(i => {
                    if (i <= 1) {
                        return [source[i], 1];
                    } else if (i === 2) {
                        return [source[i], 'foo'];
                    } else {
                        return source[i];
                    }
                }))
            ];
            const v = [[], []];
            const vo = [[], []];
            assert.doesNotThrow(() => {
                for (let i = 0; i < 2; ++i) {
                    for (const se of s[i]) {
                        v[i].push(math.Vector[dim].piecewise(...se));
                        const so = se.map(a => {
                            if (Array.isArray(a)) {
                                const o = { array: a[0] };
                                if (a.length > 1) {
                                    o.offset = a[1];
                                }
                                return o;
                            }
                            return a;
                        });
                        vo[i].push(math.Vector[dim].piecewise(...so));
                    }
                }
            }, `new Vector${dim}D.piecewise(...)`);
            for (let t = 0; t < 2; ++t) {
                const r = [
                    ref[0][t],
                    ref[1][t],
                    ref[2].foo,
                    ref[3]
                ];
                for (let i = 0; i < c.length; ++i) {
                    for (let d = 0; d < dim; ++d) {
                        assert.strictEqual(v[t][i][d], r[c[i][d]], `v[${t}][${i}][${d}] === ref[c[${i}][${d}]][${t}]`);
                        assert.strictEqual(vo[t][i][d], r[c[i][d]], `vo[${t}][${i}][${d}] === ref[c[${i}][${d}]][${t}]`);
                    }
                }
            }
            for (let t = 0; t < 2; ++t) {
                for (let i = 0; i < c.length; ++i) {
                    for (let d = 0; d < dim; ++d) {
                        v[t][i][d] *= 1.5;
                        const r = ref[c[i][d]];
                        if (Array.isArray(r)) {
                            r[t] *= 1.5;
                        } else if (r === Object(r)) {
                            r.foo *= 1.5;
                        } else {
                            ref[c[i][d]] *= 1.5;
                        }
                    }
                }
            }
        });
        test('.constructor,using,from,piecewise(<invalid arguments>)', function () {
            assert.throws(() => {
                new math.Vector[dim](Symbol('test'));
            }, TypeError);
            assert.throws(() => {
                new math.Vector[dim]({});
            }, TypeError);
            assert.throws(() => {
                new math.Vector[dim]([Symbol('test'), 3.5]);
            }, TypeError);
            assert.throws(() => {
                new math.Vector[dim]([{}, 3.5]);
            }, TypeError);
            assert.throws(() => {
                new math.Vector[dim]([[[[[[[[{}, 3.5]]]]]]]]);
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].from();
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].from(Symbol('test'));
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].from({}, 5);
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].using();
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].using(Symbol('test'));
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].using({}, 5);
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].from([1, 2, 3, 4], Symbol('test'));
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].using([1, 2, 3, 4], Symbol('test'));
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].from([1, 2, 3, 4, 5, 6, 7, 8], 20);
            }, RangeError);
            assert.throws(() => {
                math.Vector[dim].from([1, 2, 3, 4, 5, 6, 7, 8], -5);
            }, RangeError);
            assert.throws(() => {
                math.Vector[dim].using([1, 2, 3, 4, 5, 6, 7, 8], 20);
            }, RangeError);
            assert.throws(() => {
                math.Vector[dim].using([1, 2, 3, 4, 5, 6, 7, 8], -5);
            }, RangeError);
            assert.throws(() => {
                math.Vector[dim].from([2.3, Symbol('test'), 5, 8]);
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].from([2.3, {}, 5, 8]);
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].piecewise();
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].piecewise([[2, 4], 1]);
            }, TypeError);
            assert.throws(() => {
                math.Vector[dim].piecewise({ array: [2, 4], offset: 1 });
            }, TypeError);
            {
                const args = [];
                for (let i = 0; i < dim + 1; ++i) {
                    args.push([[2, 4], 1]);
                }
                assert.throws(() => {
                    math.Vector[dim].piecewise(...args);
                }, TypeError);
            }
            {
                const args = [];
                for (let i = 0; i < dim + 1; ++i) {
                    args.push({ array: [2, 4], offset: 1 });
                }
                assert.throws(() => {
                    math.Vector[dim].piecewise(...args);
                }, TypeError);
            }
            {
                const args = [];
                for (let i = 0; i < dim - 1; ++i) {
                    args.push([[2, 4], 1]);
                }
                assert.throws(() => {
                    math.Vector[dim].piecewise(...args);
                }, TypeError);
            }
            {
                const args = [];
                for (let i = 0; i < dim - 1; ++i) {
                    args.push({ array: [2, 4], offset: 1 });
                }
                assert.throws(() => {
                    math.Vector[dim].piecewise(...args);
                }, TypeError);
            }
            {
                const args = [];
                for (let i = 0; i < dim; ++i) {
                    args.push([4, 3, 1, 4]);
                }
                assert.throws(() => {
                    math.Vector[dim].piecewise(...args);
                }, TypeError);
            }
            {
                const args = [];
                for (let i = 0; i < dim; ++i) {
                    args.push([[4, 3, 1, 4], 8]);
                }
                assert.throws(() => {
                    math.Vector[dim].piecewise(...args);
                }, TypeError);
            }
            {
                const args = [];
                for (let i = 0; i < dim; ++i) {
                    args.push({ array: [4, 3, 1, 4], offset: 8 });
                }
                assert.throws(() => {
                    math.Vector[dim].piecewise(...args);
                }, TypeError);
            }
        });
        test('[Symbol.iterator]', function () {
            const r = [5, 10, 13, 18].slice(0, dim);
            const v = new math.Vector[dim](...r);
            assert.strictEqual(typeof v[Symbol.iterator], 'function', `typeof Vector${dim}D[Symbol.iterator] === 'function'`);
            let i = 0;
            for (const value of v) {
                assert.strictEqual(value, r[i], `value === r[${dim}]`);
                ++i;
            }
            const k = [...v];
            assert.strictEqual(k.length, r.length, `k.length === r.length`);
            for (let i = 0; i < r.length; ++i) {
                assert.strictEqual(k[i], r[i], `k[${i}] === r[${i}]`);
            }
        });
        test('.set(...)', function () {
            const sv = {
                2: new math.Vector2D(2, 3),
                3: new math.Vector3D(5, 7, 11),
                4: new math.Vector4D(13, 17, 19, 23)
            };
            for (let sl = 2; sl <= 4; ++sl) {
                const v = new math.Vector[dim]();
                const r = [...v];
                assert.doesNotThrow(() => {
                    v.set(sv[sl]);
                }, `Vector${dim}D.set(Vector${sl}D)`);
                assert.strictEqual(v[0], sv[sl][0], `v[0] == source[${sl}][0]`);
                assert.strictEqual(v[1], sv[sl][1], `v[1] == source[${sl}][1]`);
                if (dim >= 3) {
                    const k = sl >= 3 ? sv[sl] : r;
                    assert.strictEqual(v[2], k[2], `v[2] == ${sl >= 3 ? `source[${sl}]` : 'default'}[2]`);
                }
                if (dim >= 4) {
                    const k = sl >= 4 ? sv[sl] : r;
                    assert.strictEqual(v[3], k[3], `v[3] == ${sl >= 4 ? `source[${sl}]` : 'default'}[3]`);
                }
            }
        });
        test('.set(...)', function () {
            const sv = {
                2: new math.Vector2D(2, 3),
                3: new math.Vector3D(5, 7, 11),
                4: new math.Vector4D(13, 17, 19, 23)
            };
            for (let sl = 2; sl <= 4; ++sl) {
                const v = new math.Vector[dim]();
                if (sl === dim) {
                    const r = [...v];
                    assert.doesNotThrow(() => {
                        sv[sl].into(v);
                    }, `Vector${dim}D.set(Vector${sl}D)`);
                    assert.strictEqual(v[0], sv[sl][0], `v[0] == source[${sl}][0]`);
                    assert.strictEqual(v[1], sv[sl][1], `v[1] == source[${sl}][1]`);
                    if (dim >= 3) {
                        const k = sl >= 3 ? sv[sl] : r;
                        assert.strictEqual(v[2], k[2], `v[2] == ${sl >= 3 ? `source[${sl}]` : 'default'}[2]`);
                    }
                    if (dim >= 4) {
                        const k = sl >= 4 ? sv[sl] : r;
                        assert.strictEqual(v[3], k[3], `v[3] == ${sl >= 4 ? `source[${sl}]` : 'default'}[3]`);
                    }
                } else {
                    assert.throws(() => {
                        sv[sl].into(v);
                    }, TypeError);
                }
            }
        });
        for (const naming_scheme of [vector_dim_names, vector_color_names]) {
            const names = naming_scheme.slice(0, dim);
            for (let name_size = 1; name_size <= 4; ++name_size) {
                for (const name of permutateNameFrom(names, name_size)) {
                    const name_list = name.split('');
                    const index_list = name_list.map(n => vector_name_index[n]);
                    test(`.${name}`, function () {
                        const ref = [17, 5, 11, 3];
                        const chg = [14.5, 5.5, 4.5, 14.5];
                        const v = new math.Vector[dim](...ref.slice(0, dim));
                        let g;
                        assert.doesNotThrow(() => {
                            g = v[name];
                        }, `get Vector${dim}D.${name}`);
                        if (name_list.length >= 2) {
                            assert(g instanceof math.Vector[name_list.length], `Vector${dim}D.${name} instanceof Vector${name_list.length}D`);
                            for (let i = 0; i < index_list.length; ++i) {
                                assert.strictEqual(g[i], ref[index_list[i]], `Vector${dim}D.${name}[${index_list[i]}] === ref[${index_list[i]}]`);
                            }
                        } else {
                            assert.strictEqual(typeof g, 'number', `typeof Vector${dim}D.${name} === 'number'`);
                            assert.strictEqual(g, ref[index_list[0]], `Vector${dim}D.${name} === ref[${index_list[0]}]`);
                        }
                        assert.doesNotThrow(() => {
                            v[name] = chg.slice(0, name_list.length);
                        }, `set Vector${dim}D.${name}`);
                        let set_list = new Set();
                        for (const index of index_list) {
                            set_list.add(index);
                        }
                        set_list = [...set_list.values()];
                        const write_list = set_list.map(index => index_list.lastIndexOf(index));
                        for (let i = 0; i < set_list.length; ++i) {
                            assert.strictEqual(v[set_list[i]], chg[write_list[i]], `Vector${dim}D.${name}[${set_list[i]}] === chg[${write_list[i]}]`);
                        }
                    });
                }
            }
        }
    });
}
