function deepClone(obj, hash = new WeakMap()) {
  // Obsługa typów prostych (primitives) oraz null / undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Obsługa obiektów Date i RegExp
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);

  // Ochrona przed cyklicznymi referencjami
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // Obsługa Map i Set
  if (obj instanceof Map) {
    const mapCopy = new Map();
    hash.set(obj, mapCopy);
    obj.forEach((val, key) => {
      mapCopy.set(deepClone(key, hash), deepClone(val, hash));
    });
    return mapCopy;
  }

  if (obj instanceof Set) {
    const setCopy = new Set();
    hash.set(obj, setCopy);
    obj.forEach(val => {
      setCopy.add(deepClone(val, hash));
    });
    return setCopy;
  }

  // Tworzenie nowej instancji tablicy lub obiektu (zachowując prototyp)
  const copy = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, copy);

  // Rekurencyjne kopiowanie wszystkich właściwości (w tym pól Symbol)
  Reflect.ownKeys(obj).forEach(key => {
    copy[key] = deepClone(obj[key], hash);
  });

  return copy;
}