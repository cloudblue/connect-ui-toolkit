import View from './widget.vue';

describe('View widget', () => {
  let context;
  let result;

  describe('#data', () => {
    it('returns the initial data', () => {
      context = { activeTab: null };

      result = View.data();

      expect(result).toEqual({ activeTab: '' });
    });
  });

  describe('watch', () => {
    describe('#activeTab', () => {
      beforeEach(async () => {
        context = {
          $nextTick: vi.fn().mockResolvedValue(true),
          $injector: vi.fn(),
        };

        await View.watch.activeTab.call(context);
      });

      it('waits for the next tick', () => {
        expect(context.$nextTick).toHaveBeenCalled();
      });

      it('calls $injector with the size event', () => {
        expect(context.$injector).toHaveBeenCalledWith('$size');
      });
    });

    describe('#currentTab', () => {
      it('sets activeTab to the currentTab value', () => {
        context = { activeTab: 'foo' };

        View.watch.currentTab.handler.call(context, 'bar');

        expect(context.activeTab).toEqual('bar');
      });
    });
  });

  describe('methods', () => {
    describe('#setCurrentTab', () => {
      beforeEach(() => {
        context = {
          currentTab: '',
          activeTab: 'foo',
        };
      });

      it('does nothing if currentTab is truthy', () => {
        context.currentTab = 'foo';

        View.methods.setCurrentTab.call(context, { detail: 'bar' });

        expect(context.activeTab).not.toEqual('bar');
      });

      it('sets activeTab to the given value if currentTab is falsy', () => {
        context.currentTab = '';

        View.methods.setCurrentTab.call(context, { detail: 'bar' });

        expect(context.activeTab).toEqual('bar');
      });
    });
  });
});
