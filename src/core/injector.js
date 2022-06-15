import { clone, has } from './helpers';

export default () => {
  let $id;
  let $state = {};
  let $listners = {};
  let $watchers = {};

  const $assign = (data) => {
    if (!$state || !data) return;

    Object.keys(data).forEach((k) => {
      if (has(k, data)) $state[k] = data[k];
      if (has(k, $watchers)) $watchers[k].forEach(fn => fn());
    });

    if (has('*', $watchers)) $watchers['*'].forEach(fn => fn());
  };

  const $size = () => ({
    height: document.body.scrollHeight,
    width: document.body.scrollWidth,
  });

  const injector = {
    watch: (a, b) => {
      let fn, name;

      if (typeof a === 'function') {
        name = '*';
        fn = a;
      } else {
        name = a;
        fn = b;
      }

      if (!has(name, $watchers)) $watchers[name] = [];

      $watchers[name].push(() => {
        fn(name === '*' ? $state : $state[name]);
      });
    },

    commit: (data) => {
      $assign(data);

      window.top.postMessage({
        $id: $id || null,
        data: clone($state) || null,
      }, "*");
    },

    emit: (name, data = true) => {
      window.top.postMessage({
        $id: $id || null,
        events: {
          [name]: data,
        },
      }, "*");
    },

    listen: (name, cb) => {
      $listners[name] = cb;
    },
  };

  injector.listen('$init', (data = {}, { $id: id }) => {
    $id = id;
    $state = data;

    injector.emit('$size', $size());
    setInterval(() => injector.emit('$size', $size()), 300);
  });

  injector.listen('$size', () => injector.emit('$size', $size()));

  window.addEventListener('$injector', ({ detail }) => {
    let { type, data } = detail;

    if (type === '$size') data = $size();

    injector.emit(type, data);
  });

  window.addEventListener('message', ({ data: $data }) => {
    if (!$data?.$id) return;

    const { $id: id, data, events } = $data;

    if (events) {
      Object.keys(events).forEach((event) => {
        if ($listners[event]) $listners[event](events[event], $data);
      });
    } else {
      if ($id !== id) return;

      $assign(data);
    }
  });

  injector.emit('$mounted');

  return injector;
}