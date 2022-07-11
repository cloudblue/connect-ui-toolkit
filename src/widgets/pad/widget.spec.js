import pad from './widget';

describe('Pad widget', () => {
  let context;

  describe('#computed', () => {
    describe('opened', () => {
      it.each([
        ['foo', 'foo', false, true],
        ['foo', 'foo', true, true],
        ['foo', 'bar', false, false],
        ['foo', 'bar', true, false],
        [null, 'foo', true, true],
        [null, 'foo', false, false],
      ])('For requested = %j and pad = %j with default = %j expected to be %j', ($req, $pad, $def, $res) => {
        expect(pad.computed.opened({
          requested: $req,
          pad: $pad,
          default: $def,
        })).toBe($res);
      });
    });
  });

  describe('#data()', () => {
    it('should return initial set', () => {
      expect(pad.data()).toEqual({ requested: null });
    });
  });

  describe('#created()', () => {
    beforeEach(() => {
      context = {
        requested: null,
        $boiler: {
          subscribe: jest.fn(),
        },
      };

      pad.created.call(context);
    });

    it('should call $boiler.subscribe', () => {
      expect(context.$boiler.subscribe).toHaveBeenCalledWith('open-pad', expect.any(Function));
    });

    it('should provide a callback, that will set #requested with provided pad id', () => {
      const handler = context.$boiler.subscribe.mock.calls[0][1];
      handler({ pad: 'foo' });
      expect(context.requested).toBe('foo');
    });
  });

  describe('#watch', () => {
    describe('#opened()', () => {
      beforeEach(() => {
        context = {
          $nextTick: jest.fn(),
          $injector: jest.fn(),
        };
      });

      it('should call $nextTick when value passed', async () => {
        await pad.watch.opened.call(context,true);
        expect(context.$nextTick).toHaveBeenCalled();
      });

      it('should emit $injector "$size"', async () => {
        await pad.watch.opened.call(context,true);
        expect(context.$injector).toHaveBeenCalledWith('$size');
      });

      it('should do nothing when value is falsy', async () => {
        await pad.watch.opened.call(context,false);
        expect(context.$nextTick).not.toHaveBeenCalled();
      });
    });
  });
});