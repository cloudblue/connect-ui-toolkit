const getId = () => ([1e7]+-1e3+-4e3+-8e3+-1e11)
  .replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4)
    .toString(16));

export default (injector, core, options = {}) => new Promise((resolve) => {

  core.id = window.name || `slot_${getId()}`;
  injector.emit('$created');

  injector.listen('$init', (data) => {
    core.state = data;


    if (!options?.disableAutoResizing) {
      injector.emit('$size', core.size());
      setInterval(() => injector.emit('$size', core.size()), 300);
    }
    
    resolve();
  });

  window.addEventListener('$injector', ({ detail }) => {
    let { type, data } = detail;

    if (type === '$size') data = core.size();

    injector.emit(type, data);
  });

  window.addEventListener('message', ({ data: $data }) => {
    if ($data?.$id !== core.id) return;
    const { data, events } = $data;

    if (events) {
      Object.keys(events).forEach((event) => {
        if (core.listeners[event]) core.listeners[event](events[event], $data);
      });
    } else if (data) {
      core.assign(data);
    }
  });

  injector.emit('$mounted');
});