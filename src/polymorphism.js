/* eslint-disable no-extend-native */
const polymorphism = Symbol('polymorphism');
export default polymorphism;

export const internal = Symbol('internal');

Number.prototype[polymorphism] = Symbol('Number.polymorphism');
