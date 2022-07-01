import { clone, has, call } from './helpers';


export class State {
  constructor() {
    this.$id = null;
    this.$state = {};
    this.$listeners = {};
    this.$watchers = {};
  }

  $assign(data) {
    if (!this.$state || !data) return;

    Object.keys(data).forEach((k) => {
      if (has(k, this.$state)) this.$state[k] = data[k];
      if (has(k, this.$watchers)) this.$watchers[k].forEach(call);
    });

    if (has('*', this.$watchers)) this.$watchers['*'].forEach(call);
  }

  $size() {
    return {
      height: document.body.scrollHeight,
      width: document.body.scrollWidth,
    }
  }
}

export const injectorFactory = state => ({
  watch(a, b) {
    let fn, name;

    if (typeof a === 'function') {
      name = '*';
      fn = a;
    } else {
      name = a;
      fn = b;
    }

    if (!has(name, state.$watchers)) state.$watchers[name] = [];

    state.$watchers[name].push(() => {
      fn(name === '*' ? state.$state : state.$state[name]);
    });
  },

  commit(data) {
    state.$assign(data);

    window.top.postMessage({
      $id: state.$id || null,
      data: state.$state ? clone(state.$state) : null,
    }, "*");
  },

  emit(name, data = true) {
    window.top.postMessage({
      $id: state.$id || null,
      events: {
        [name]: data,
      },
    }, "*");
  },

  listen(name, cb) {
    state.$listeners[name] = cb;
  },
});

export const $init = (injector, state) => {
  injector.listen('$init', (data, { $id: id }) => {
    state.$id = id;
    state.$state = data;

    injector.emit('$size', state.$size());
    setInterval(() => injector.emit('$size', state.$size()), 300);
  });

  window.addEventListener('$injector', ({ detail }) => {
    let { type, data } = detail;

    if (type === '$size') data = state.$size();

    injector.emit(type, data);
  });

  window.addEventListener('message', ({ data: $data }) => {
    if (!$data?.$id) return;

    const { $id: id, data, events } = $data;

    if (events) {
      Object.keys(events).forEach((event) => {
        if (state.$listeners[event]) state.$listeners[event](events[event], $data);
      });
    } else {
      if (id !== state.$id) return;

      state.$assign(data);
    }
  });

  injector.emit('$mounted');
}

export default () => {
  const state = new State();
  const injector = injectorFactory(state);

  $init(injector, state);

  return injector;
}