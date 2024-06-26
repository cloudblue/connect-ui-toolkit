import launch from './launcher';

const resizeObserverCtorSpy = vi.fn();
const resizeObserverObserveSpy = vi.fn();
const resizeObserverEntriesStub = [
  {
    contentRect: {
      height: 400,
      width: 800,
    },
  },
];
const ResizeObserverMock = function ResizeObserverMock(callback) {
  resizeObserverCtorSpy(callback);

  callback(resizeObserverEntriesStub);

  return {
    observe: resizeObserverObserveSpy,
  };
};
Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});

describe('$init', () => {
  let injector;
  let core;
  let init;

  beforeEach(() => {
    global.window.addEventListener = vi.fn();
    global.window.name = 'XXX';
    global.crypto.getRandomValues = vi.fn(() => ['abc']);

    injector = {
      listen: vi.fn(),
      emit: vi.fn(),
    };

    core = {
      size: vi.fn(() => 'SIZE'),
      assign: vi.fn(),
    };

    init = () => launch(injector, core);
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

      expect(core.id).toBe('XXX');
    });

    it('should handler should set passed data to state', () => {
      handler({ foo: 'BAR' }, {});

      expect(core.state).toEqual({ foo: 'BAR' });
    });

    it('should emit "$size" event', () => {
      handler({}, {});

      expect(injector.emit.mock.calls[2]).toEqual([
        '$size',
        {
          height: 400,
          width: 800,
        },
      ]);
    });

    it('should create a ResizeObserver instance', () => {
      handler({}, {});

      expect(resizeObserverCtorSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should call the resize observer's observe method with the document body", () => {
      handler({}, {});

      expect(resizeObserverObserveSpy).toHaveBeenCalledWith(document.body);
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

      expect(injector.emit.mock.calls[2]).toEqual(['event_name', { foo: 'bar' }]);
    });

    it('should fill size for $size type', () => {
      handler({ detail: { type: '$size' } });

      expect(injector.emit.mock.calls[2]).toEqual([
        '$size',
        {
          height: 0,
          width: 0,
        },
      ]);
    });
  });

  describe('places a listener for "message"', () => {
    let name;
    let handler;

    beforeEach(() => {
      init();
      name = window.addEventListener.mock.calls[1][0];
      handler = window.addEventListener.mock.calls[1][1];
      core.id = 'XXX';
    });

    it('should place a correct listener name', () => {
      expect(name).toBe('message');
    });

    it('should early return when no $id provided', () => {
      handler({ data: {} });

      expect(core.assign).not.toHaveBeenCalled();
    });

    it('should launch proper listeners when handling events', () => {
      const data = {
        $id: 'XXX',
        events: {
          test: 'TEST',
          foo: 'bar',
        },
      };

      core.listeners = { test: vi.fn() };
      handler({ data });

      expect(core.listeners.test).toHaveBeenCalledWith('TEST', data);
    });

    it('should call state.$assign with proper data when id is correct', () => {
      handler({
        data: {
          $id: 'XXX',
          data: { foo: 'bar' },
        },
      });

      expect(core.assign).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should do nothing with processing data if id is not correct', () => {
      handler({
        data: {
          $id: 'YYY',
          data: { foo: 'bar' },
        },
      });

      expect(core.assign).not.toHaveBeenCalled();
    });

    it('should emit $mounted event', () => {
      expect(injector.emit).toHaveBeenCalledWith('$mounted');
    });
  });
});
