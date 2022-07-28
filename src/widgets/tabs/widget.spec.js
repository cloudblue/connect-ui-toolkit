import tabs from './widget.vue';


describe('Tabs', () => {
  describe('#created()', () => {
    let context;
    let handler;

    beforeEach(() => {
      context = {
        $boiler: {
          publishes: jest.fn(),
          publish: jest.fn(),
          listen: jest.fn(),
        }
      };

      tabs.created.call(context);

      handler = context.$boiler.listen.mock.calls[0][1];
    });

    it('should call $boiler.publishes', () => {
      expect(context.$boiler.publishes).toHaveBeenCalledWith('open-pad');
    });

    it('should call $boiler.listen', () => {
      expect(context.$boiler.listen).toHaveBeenCalledWith('click-tab', expect.any(Function));
    });

    it('should publish $boiler.publish with handler', () => {
      handler({ tab: 'foo' });
      expect(context.$boiler.publish).toHaveBeenCalledWith('open-pad', { pad: 'foo' });
    });
  });
});