class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener musi być funkcją');
    }
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(listener);
    return this;
  }

  emit(eventName, ...args) {
    const listeners = this.events.get(eventName);
    if (!listeners || listeners.length === 0) return false;

    // Kopia tablicy zapobiega błędom, gdy w trakcie wywołania nastąpi zmiana subskrypcji
    [...listeners].forEach(listener => listener(...args));
    return true;
  }

  off(eventName, listener) {
    const listeners = this.events.get(eventName);
    if (!listeners) return this;

    const filtered = listeners.filter(
      fn => fn !== listener && fn._originalListener !== listener
    );

    if (filtered.length > 0) {
      this.events.set(eventName, filtered);
    } else {
      this.events.delete(eventName);
    }
    return this;
  }

  once(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener musi być funkcją');
    }

    const wrapper = (...args) => {
      this.off(eventName, wrapper);
      listener(...args);
    };

    // Zapamiętanie oryginalnej funkcji na potrzeby metody off() przed wywołaniem
    wrapper._originalListener = listener;
    this.on(eventName, wrapper);
    return this;
  }
}