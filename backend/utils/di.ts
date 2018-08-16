import 'reflect-metadata';

/**
 * Copié de
 * https://nehalist.io/dependency-injection-in-typescript/
 */

interface Type<T> {
  new(...args: any[]): T;
}

type GenericClassDecorator<T> = (target: T) => void;

/**
 * Permet l'injection de dépendence par type dans un le constructeur de la classe décoré
 * Si une class n'est pas décorée, elle n'a pas de meta données
 */
export const Service = (): GenericClassDecorator<Type<object>> => {
  return (target: Type<object>) => {};
};

/**
 * Permet l'injection de dépendence par type dans un le constructeur de la classe décoré
 * Si une class n'est pas décorée, elle n'a pas de meta données
 */
export const Api = (): GenericClassDecorator<Type<object>> => {
  return (target: Type<object>) => {};
};

/**
 * Permet d'injecter manuellement une dépendence
 */
export const Injector = new class {
  // resolving instances
  resolve<T>(target: Type<any>): T {
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    const injections = tokens.map(token => Injector.resolve<any>(token));

    return new target(...injections);
  }
};
