import polymorphism from './polymorphism.js';
import { implementation } from './implementation.js';

export function add(a, b) {
    return implementation[a[polymorphism]][b[polymorphism]].add(a, b);
}

export function sub(a, b) {
    return implementation[a[polymorphism]][b[polymorphism]].sub(a, b);
}

export function mul(a, b) {
    return implementation[a[polymorphism]][b[polymorphism]].mul(a, b);
}

export function div(a, b) {
    return implementation[a[polymorphism]][b[polymorphism]].div(a, b);
}

export function mod(a, b) {
    return implementation[a[polymorphism]][b[polymorphism]].mod(a, b);
}

export function dot(a, b) {
    return implementation[a[polymorphism]][b[polymorphism]].dot(a, b);
}

export function cross(a, b) {
    return implementation[a[polymorphism]][b[polymorphism]].cross(a, b);
}

export function neg(x) {
    return implementation[x[polymorphism]].neg(x);
}

export * as limits from './lib/limits.js';
export * from './lib/power.js';
export { default as Vector2D } from './Vector2D.js';
export { default as Vector3D } from './Vector3D.js';
export { default as Vector4D } from './Vector4D.js';