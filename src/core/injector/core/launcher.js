export default (injector, core) => {
  injector.listen('$init', (data, { $id: id }) => {
    core.id = id;
    core.state = data;

    injector.emit('$size', core.size());
    setInterval(() => injector.emit('$size', core.size()), 300);
  });

  window.addEventListener('$injector', ({ detail }) => {
    let { type, data } = detail;

    if (type === '$size') data = core.size();

    injector.emit(type, data);
  });

  window.addEventListener('message', ({ data: $data }) => {
    if (!$data?.$id) return;

    const { $id: id, data, events } = $data;

    if (events) {
      Object.keys(events).forEach((event) => {
        if (core.listeners[event]) core.listeners[event](events[event], $data);
      });
    } else {
      if (id !== core.id) return;

      core.assign(data);
    }
  });

  injector.emit('$mounted');
}