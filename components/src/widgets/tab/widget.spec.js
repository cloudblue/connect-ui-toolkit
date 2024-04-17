import Tab from './widget.vue';

describe('Tab', () => {
  let context;
  let result;

  describe('#data', () => {
    it('returns the initial data', () => {
      result = Tab.data();

      expect(result).toEqual({ requested: null });
    });
  });

  describe('computed', () => {
    describe('#selected', () => {
      it.each([
        // expected, requested, tab, active
        [true, 'foo', 'foo', false],
        [true, 'foo', 'foo', true],
        [false, 'foo', 'bar', false],
        [false, 'foo', 'bar', true],
        [false, '', 'bar', false],
        [true, '', 'bar', true],
      ])('returns %s if requested=%s, tab=%s, active=%s', (expected, requested, tab, active) => {
        context = { requested, tab, active };

        result = Tab.computed.selected(context);

        expect(result).toEqual(expected);
      });
    });
  });

  describe('lifecycle hooks', () => {
    describe('#created', () => {
      beforeEach(() => {
        context = {
          active: false,
          requested: null,
          $bus: { on: vi.fn() },
          open: vi.fn(),
        };
      });

      it('should call $bus.on', () => {
        Tab.created.call(context);

        expect(context.$bus.on).toHaveBeenCalledWith('click-tab', expect.any(Function));
      });

      it('should provide a callback, that will set requested to the value of the given tab', () => {
        Tab.created.call(context);
        const handler = context.$bus.on.mock.calls[0][1];

        handler('foo');

        expect(context.requested).toBe('foo');
      });

      it('should call open if active=true', () => {
        context.active = true;

        Tab.created.call(context);

        expect(context.open).toHaveBeenCalled();
      });

      it('should not call open if active=false', () => {
        context.active = false;

        Tab.created.call(context);

        expect(context.open).not.toHaveBeenCalled();
      });
    });
  });

  describe('methods', () => {
    describe('#open', () => {
      it('should call $bus.emit', () => {
        context = {
          tab: 'foo',
          $bus: {
            emit: vi.fn(),
          },
        };

        Tab.methods.open.call(context);

        expect(context.$bus.emit).toHaveBeenCalledWith('click-tab', 'foo');
      });
    });
  });
});
