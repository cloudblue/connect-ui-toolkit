import Pad from './widget';

describe('Pad widget', () => {
  let context;
  let result;

  describe('#data', () => {
    it('returns the initial data', () => {
      result = Pad.data();

      expect(result).toEqual({ requested: null });
    });
  });

  describe('computed', () => {
    describe('#opened', () => {
      it.each([
        // expected, requested, pad, active
        [true, 'foo', 'foo', false],
        [true, 'foo', 'foo', true],
        [false, 'foo', 'bar', false],
        [false, 'foo', 'bar', true],
        [false, '', 'bar', false],
        [true, '', 'bar', true],
      ])('returns %s if requested=%s, pad=%s, active=%s', (expected, requested, pad, active) => {
        context = { requested, pad, active };

        result = Pad.computed.opened(context);

        expect(result).toEqual(expected);
      });
    });
  });

  describe('lifecycle hooks', () => {
    describe('#created', () => {
      beforeEach(() => {
        context = {
          requested: null,
          $bus: { on: jest.fn() },
        };

        Pad.created.call(context);
      });

      it('should call $bus.on', () => {
        expect(context.$bus.on).toHaveBeenCalledWith('click-tab', expect.any(Function));
      });

      it('should provide a callback, that will set requested to the value of the given tab', () => {
        const handler = context.$bus.on.mock.calls[0][1];

        handler('foo');

        expect(context.requested).toBe('foo');
      });
    });
  });

  describe('watch', () => {
    describe('#opened', () => {
      beforeEach(() => {
        context = {
          $nextTick: jest.fn(),
          $injector: jest.fn(),
        };
      });

      it('should call $nextTick when value passed', async () => {
        await Pad.watch.opened.call(context, true);

        expect(context.$nextTick).toHaveBeenCalled();
      });

      it('should emit $injector "$size"', async () => {
        await Pad.watch.opened.call(context, true);

        expect(context.$injector).toHaveBeenCalledWith('$size');
      });

      it('should do nothing when value is falsy', async () => {
        await Pad.watch.opened.call(context, false);

        expect(context.$nextTick).not.toHaveBeenCalled();
      });
    });
  });
});
