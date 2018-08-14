import 'reflect-metadata';

/**
 * Copié de
 * https://nehalist.io/dependency-injection-in-typescript/
 */

interface Type<T> {
  new(...args: any[]): T;
}

type GenericClassDecorator<T> = (target: T) => void;

export const Service = (): GenericClassDecorator<Type<object>> => {
  return (target: Type<object>) => {};
};
export const Api = (): GenericClassDecorator<Type<object>> => {
  return (target: Type<object>) => {};
};

export const Injector = new class {
  // resolving instances
  resolve<T>(target: Type<any>): T {
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    const injections = tokens.map(token => Injector.resolve<any>(token));

    return new target(...injections);
  }
};
