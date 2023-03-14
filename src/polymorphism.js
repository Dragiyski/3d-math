/* eslint-disable no-extend-native */
const polymorphism = Symbol('polymorphism');
export default polymorphism;

Number.prototype[polymorphism] = Symbol('Number.polymorphism');
Array.prototype[polymorphism] = Symbol('Array.polymorphism');
Float32Array.prototype[polymorphism] = Symbol('Float32Array.polymorphism');
Float64Array.prototype[polymorphism] = Symbol('Float64Array.polymorphism');
ArrayBuffer.prototype[polymorphism] = Symbol('ArrayBuffer.polymorphism');
