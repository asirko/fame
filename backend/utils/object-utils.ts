/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item) && !(item instanceof Date));
}

/**
 * Deep merge two objects.
 * mutate target to add/copy all properties of all sources
 * @param target
 * @param sources all objects to merge
 */
export function mergeDeep<T>(target: any, ...sources: any[]): T {
  sources.forEach(source => simpleMergeDeep(target, source));
  return <T>target;
}

/**
 * mutate target to add/copy all properties of the source
 * @param target
 * @param source
 */
function simpleMergeDeep(target: any, source: any) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (isObject(source[key])) {
          if (!target[key]) {
            target[key] = {};
          }
          simpleMergeDeep(target[key], source[key]);
        } else {
          target[key] = clone(source[key]);
        }
      }
    }
  } else {
    console.error('can only merge object');
  }
}

export function clone<T>(val: any): T {
  let result;
  if (Array.isArray(val)) {
    result = val.map(v => clone(v));
  } else if (val instanceof Date)  {
    result = new Date(val.getTime());
  } else if (typeof val === 'object') {
    result = mergeDeep({}, val);
  } else {
    result = val;
  }

  return result;
}
