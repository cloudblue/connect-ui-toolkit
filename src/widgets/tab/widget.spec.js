import tab from './widget';


describe('Tab', () => {
  let context;

  describe('#computed', () => {
    describe('#active', () => {
      it.each([
        ['foo', 'foo', null, true],
        ['foo', 'foo', 'foo', true],
        ['foo', 'bar', null, false],
        ['foo', 'bar', 'bar', false],
        [null, 'foo', null, false],
        [null, 'foo', 'bar', true],
      ])('For requested = %j and pad = %j with default = %j expected to be %j', ($req, $tab, $def, $res) => {
        expect(tab.computed.active({
          requested: $req,
          tab: $tab,
          default: $def,
        })).toBe($res);
      });
    });
  });

  describe('#data()', () => {
    it('should return initial set', () => {
      expect(tab.data()).toEqual({ requested: null });
    });
  });

  describe('#created()', () => {
    let created;

    beforeEach(() => {
      context = {
        default: true,
        open: jest.fn(),
        $boiler: {
          subscribe: jest.fn(),
          style: jest.fn(),
        },
      };

      created = () => tab.created.call(context);
    });

    it('should subscribe for "open-pad" event', () => {
      created();
      expect(context.$boiler.subscribe).toHaveBeenCalledWith('open-pad', expect.any(Function));
    });

    it('should set #requested with passed pad in handler', () => {
      created();
      const handler = context.$boiler.subscribe.mock.calls[0][1];
      handler({ pad: 'foo' });
      expect(context.requested).toBe('foo');
    });

    it('should call #open() when is default', () => {
      created();
      expect(context.open).toHaveBeenCalled();
    });

    it('should not call #open() when is not default', () => {
      context.default = false;
      created();
      expect(context.open).not.toHaveBeenCalled();
    });

    describe('#style', () => {
      let handler;
      let element;
      let isFirstChild;

      beforeEach(() => {
        isFirstChild = true;
        created();
        handler = context.$boiler.style.mock.calls[0][0];
        element = {
          matches: jest.fn(() => isFirstChild),
        };
      });

      it('should call $boiler.style', () => {
        expect(context.$boiler.style).toHaveBeenCalledWith(expect.any(Function));
      });

      it('handler should check if element matches selector', () => {
        handler(element);
        expect(element.matches).toHaveBeenCalledWith('*:first-child');
      });

      it('should return styles for first child', () => {
        expect(handler(element)).toEqual({
          display: 'inline-flex',
          flexDirection: 'row',
          position: 'relative',
          alignItems: 'center',
          marginLeft: 0,
          lineHeight: '3.2em',
          whiteSpace: 'nowrap',
          color: '#212121',
          cursor: 'pointer',
          fontWeight: '500',
        });
      });

      it('should return styles for not first child', () => {
        isFirstChild = false;
        expect(handler(element)).toEqual({
          display: 'inline-flex',
          flexDirection: 'row',
          position: 'relative',
          alignItems: 'center',
          marginLeft: '1.6em',
          lineHeight: '3.2em',
          whiteSpace: 'nowrap',
          color: '#212121',
          cursor: 'pointer',
          fontWeight: '500',
        });
      });
    });
  });

  describe('#methods', () => {
    describe('#open()', () => {
      it('should call #$boiler.dispatch', () => {
        context = {
          tab: 'foo',
          $boiler: {
            dispatch: jest.fn(),
          },
        };

        tab.methods.open.call(context);

        expect(context.$boiler.dispatch).toHaveBeenCalledWith('click-tab', {
          tab: 'foo',
        });
      });
    });
  });
});
