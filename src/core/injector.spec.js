import createInjector, {
  injectorFactory,
  State,
  $init,
} from './injector';


describe('State', () => {
  let state;

  beforeEach(() => {
    state = new State();
  });

  describe('initial sets', () => {
    it.each([
      ['$id', null],
      ['$state', {}],
      ['$listeners', {}],
      ['$watchers', {}],
    ])('should set %j to %j', (key, val) => {
      expect(state[key]).toEqual(val);
    });
  });

  describe('#$assign()', () => {
    it.each([
      [null, null],
      [{ test: 123 }, null],
      [null, { test: 123 }],
    ])('should do nothing while $state is %j and data is %j', ($state, data) => {
      global.Object.keys = jest.fn(Object.keys);
      state.$state = $state;
      state.$assign(data);

      expect(Object.keys).not.toHaveBeenCalledWith(data);
    });

    it('should assign passed data to a state', () => {
      state.$state = {
        test: 'TEST',
      };

      state.$assign({
        test: 'NEW_TEST',
        foo: 'bar',
      });

      expect(state.$state).toEqual({
        test: 'NEW_TEST',
      })
    });

    it('should launch proper watchers', () => {
      state.$state = {
        test: 'TEST',
        foo: 'BAR',
      };

      state.$watchers = {
        test: [jest.fn()],
      };

      state.$assign({
        test: 'NEW_TEST',
        foo: 'bar',
      });

      expect(state.$watchers.test[0]).toHaveBeenCalled();
    });

    it('should launch all watchers with "*" key', () => {
      state.$state = {
        test: 'TEST',
        foo: 'BAR',
      };

      state.$watchers = {
        '*': [jest.fn()],
      };

      state.$assign({
        test: 'NEW_TEST',
        foo: 'bar',
      });

      expect(state.$watchers['*'][0]).toHaveBeenCalled();
    });
  });

  describe('#size', () => {
    it('should return document size in proper format', () => {
      jest.spyOn(global.document.body, 'scrollHeight', 'get').mockReturnValue(100)
      jest.spyOn(global.document.body, 'scrollWidth', 'get').mockReturnValue(300)

      expect(state.$size()).toEqual({
        width: 300,
        height: 100,
      })
    });
  });
});

describe('injectorFactory', () => {
  describe('#watch()', () => {
    it('should add callback as new watcher for passed property', () => {
      const state = { $watchers: {}, $state: { foo: 'bar' } };
      const injector = injectorFactory(state);
      const cb = jest.fn();

      injector.watch('foo', cb);
      state.$watchers.foo[0]();

      expect(cb).toHaveBeenCalledWith('bar')
    });

    it('should extend existing watcher for passed property with a callback', () => {
      const state = {
        $watchers: { foo: [() => {}]},
        $state: { foo: 'bar' },
      };

      const injector = injectorFactory(state);
      const cb = jest.fn();

      injector.watch('foo', cb);
      state.$watchers.foo[1]();

      expect(cb).toHaveBeenCalledWith('bar')
    });

    it('should add a callback as watcher for whole state if just callback passed', () => {
      const state = {
        $watchers: {},
        $state: { foo: 'bar', bar: 'foo' },
      };

      const injector = injectorFactory(state);
      const cb = jest.fn();

      injector.watch(cb);
      state.$watchers['*'][0]();

      expect(cb).toHaveBeenCalledWith({ foo: 'bar', bar: 'foo' });
    });
  });

  describe('#commit()', () => {
    let state;
    let commit;

    beforeEach(() => {
      global.window.top.postMessage = jest.fn();

      state = {
        $assign: jest.fn(),
        $id: 'XXX',
        $state: {
          foo: 'bar',
        },
      };

      commit = (data) => {
        injectorFactory(state).commit(data);
      };
    });

    it('should call $assign() with passed data', () => {
      commit({ foo: 'BAR' });

      expect(state.$assign).toHaveBeenCalledWith({ foo: 'BAR' });
    });

    it('should call window.top.postMessage() with proper id and data', () => {
      commit({ foo: 'BAR' });

      expect(window.top.postMessage).toHaveBeenCalledWith({
        $id: 'XXX',
        data: { foo: 'bar' },
      }, '*');
    });

    it('should set null by default for passed state props', () => {
      state.$id = undefined;
      state.$state = undefined;
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
      injectorFactory({ $id: 'XXX' }).emit('foo', 'BAR');

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
      injectorFactory({ $id: 'XXX' }).emit('foo');

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
      const state = { $listeners: {} };
      const cb = jest.fn();
      injectorFactory(state).listen('foo', cb);
      state.$listeners.foo();

      expect(cb).toHaveBeenCalled();
    });
  });
});

describe('$init', () => {
  let injector;
  let state;
  let init;

  beforeEach(() => {
    global.window.addEventListener = jest.fn();
    global.setInterval = jest.fn();

    injector = {
      listen: jest.fn(),
      emit: jest.fn(),
    };

    state = {
      $size: jest.fn(() => 'SIZE'),
      $assign: jest.fn(),
    };

    init = () => $init(injector, state);
  });

  describe('places listener for "$init" event', () => {
    let name;
    let handler;

    beforeEach(() => {
      init();
      name = injector.listen.mock.calls[0][0];
      handler = injector.listen.mock.calls[0][1];
    });

    it('should set listener for proper event name', () => {
      expect(name).toEqual('$init');
    });

    it('handler should set proper id to state', () => {
      handler({}, { $id: 'XXX' });
      expect(state.$id).toBe('XXX');
    });

    it('should handler should set passed data to state', () => {
      handler({ foo: 'BAR' }, {});
      expect(state.$state).toEqual({ foo: 'BAR' });
    });

    it('should emit "$size" event', () => {
      handler({}, {});
      expect(injector.emit.mock.calls[1]).toEqual(['$size', 'SIZE']);
    });

    it('should get sizes from $size method', () => {
      handler({}, {});
      expect(state.$size).toHaveBeenCalled();
    });

    it('should set interval', () => {
      handler({}, {});
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 300);
    });

    it('should set interval for sizing', () => {
      handler({}, {});
      injector.emit.mock.calls = [];
      setInterval.mock.calls[0][0]();
      expect(injector.emit).toHaveBeenCalledWith('$size', 'SIZE');
    });
  });

  describe('places a listener for "$injector"', () => {
    let name;
    let handler;

    beforeEach(() => {
      init();
      name = window.addEventListener.mock.calls[0][0];
      handler = window.addEventListener.mock.calls[0][1];
    });

    it('should set event listener with proper name', () => {
      expect(name).toBe('$injector');
    });

    it('should emit proper listener event', () => {
      handler({ detail: { type: 'event_name', data: { foo: 'bar' } } });

      expect(injector.emit.mock.calls[1]).toEqual(['event_name', { foo: 'bar' }]);
    });

    it('should fill size for $size type', () => {
      handler({ detail: { type: '$size' } });

      expect(injector.emit.mock.calls[1]).toEqual(['$size', 'SIZE']);
    });
  });

  describe('places a listener for "message"', () => {
    let name;
    let handler;

    beforeEach(() => {
      init();
      name = window.addEventListener.mock.calls[1][0];
      handler = window.addEventListener.mock.calls[1][1];
      state.$id = 'XXX';
    });

    it('should place a correct listener name', () => {
      expect(name).toBe('message');
    });

    it('should early return when no $id provided', () => {
      handler({ data: {} });

      expect(state.$assign).not.toHaveBeenCalled();
    });

    it('should launch proper listeners when handling events', () => {
      const data = {
        $id: 'XXX',
        events: {
          test: 'TEST',
          foo: 'bar',
        },
      };

      state.$listeners = { test: jest.fn() };
      handler({ data });

      expect(state.$listeners.test).toHaveBeenCalledWith('TEST', data);
    });

    it('should call state.$assign with proper data when id is correct', () => {
      handler({
        data: {
          $id: 'XXX',
          data: { foo: 'bar' },
        },
      });

      expect(state.$assign).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should do nothing with processing data if id is not correct', () => {
      handler({
        data: {
          $id: 'YYY',
          data: { foo: 'bar' },
        },
      });

      expect(state.$assign).not.toHaveBeenCalled();
    });

    it('should emit $mounted event', () => {
      expect(injector.emit).toHaveBeenCalledWith('$mounted');
    });
  });
});
