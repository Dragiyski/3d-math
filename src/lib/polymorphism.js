const polymorphism = Symbol('polymorphism');

export default polymorphism;

Number.prototype[polymorphism] = Symbol('Number.polymorphism');
