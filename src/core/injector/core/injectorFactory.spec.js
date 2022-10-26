import injectorFactory from './injectorFactory';

describe('injectorFactory', () => {
  describe('#watch()', () => {
    it('should add callback as new watcher for passed property', () => {
      const core = { watchers: {}, state: { foo: 'bar' } };
      const injector = injectorFactory(core);
      const cb = jest.fn();

      injector.watch('foo', cb);
      core.watchers.foo[0]();

      expect(cb).toHaveBeenCalledWith('bar')
    });

    it('should add immediate callback call', () => {
      const core = { watchers: {}, state: { foo: 'bar' } };
      const injector = injectorFactory(core);
      const cb = jest.fn();

      injector.watch('foo', cb, { immediate: true });

      expect(cb).toHaveBeenCalledWith('bar');
    });

    it('should add immediate callback call with "*" key', () => {
      const core = { watchers: {}, state: { foo: 'bar' } };
      const injector = injectorFactory(core);
      const cb = jest.fn();

      injector.watch('*', cb, { immediate: true });

      expect(cb).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should extend existing watcher for passed property with a callback', () => {
      const core = {
        watchers: { foo: [() => {}]},
        state: { foo: 'bar' },
      };

      const injector = injectorFactory(core);
      const cb = jest.fn();

      injector.watch('foo', cb);
      core.watchers.foo[1]();

      expect(cb).toHaveBeenCalledWith('bar')
    });

    it('should add a callback as watcher for whole state if just callback passed', () => {
      const core = {
        watchers: {},
        state: { foo: 'bar', bar: 'foo' },
      };

      const injector = injectorFactory(core);
      const cb = jest.fn();

      injector.watch(cb);
      core.watchers['*'][0]();

      expect(cb).toHaveBeenCalledWith({ foo: 'bar', bar: 'foo' });
    });
  });

  describe('#commit()', () => {
    let core;
    let commit;

    beforeEach(() => {
      global.window.top.postMessage = jest.fn();

      core = {
        assign: jest.fn(),
        id: 'XXX',
        state: {
          foo: 'bar',
        },
      };

      commit = (data) => {
        injectorFactory(core).commit(data);
      };
    });

    it('should call $assign() with passed data', () => {
      commit({ foo: 'BAR' });

      expect(core.assign).toHaveBeenCalledWith({ foo: 'BAR' });
    });

    it('should call window.top.postMessage() with proper id and data', () => {
      commit({ foo: 'BAR' });

      expect(window.top.postMessage).toHaveBeenCalledWith({
        $id: 'XXX',
        data: { foo: 'bar' },
      }, '*');
    });

    it('should set null by default for passed state props', () => {
      core.id = undefined;
      core.state = undefined;
      commit({ foo: 'BAR' });

      expect(window.top.postMessage).toHaveBeenCalledWith({
        $id: null,
        data: null,
      }, '*');
    });
  });

  describe('#emit()', () => {
    beforeEach(() => {
      global.window.top.postMessage = jest.fn();
    });

    it('should emit proper event', () => {
      injectorFactory({ id: 'XXX' }).emit('foo', 'BAR');

      expect(window.top.postMessage).toHaveBeenCalledWith({
        $id: 'XXX',
        events: {
          foo: 'BAR',
        },
      }, '*');
    });

    it('should set $id to null when not passed', () => {
      injectorFactory({}).emit('foo', 'BAR');

      expect(window.top.postMessage).toHaveBeenCalledWith({
        $id: null,
        events: {
          foo: 'BAR',
        },
      }, '*');
    });


    it('should set data to true by default', () => {
      injectorFactory({ id: 'XXX' }).emit('foo');

      expect(window.top.postMessage).toHaveBeenCalledWith({
        $id: 'XXX',
        events: {
          foo: true,
        },
      }, '*');
    });
  });

  describe('#listen()', () => {
    it('should put provided callback to proper listeners', () => {
      const core = { listeners: {} };
      const cb = jest.fn();
      injectorFactory(core).listen('foo', cb);
      core.listeners.foo();

      expect(cb).toHaveBeenCalled();
    });
  });
});
