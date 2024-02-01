import Tabs from './widget.vue';


const customEventConstructorSpy = jest.fn();
Object.defineProperty(global, 'CustomEvent', {
  writable: true,
  configurable: true,
  value: function (name, opts) {
    customEventConstructorSpy(name, opts);

    return { name };
  },
});

describe('Tabs', () => {
  let context;
  let result;

  describe('methods', () => {
    describe('#open', () => {
      beforeEach(() => {
        context = {
          currentTab: 'foo',
          $el: { dispatchEvent: jest.fn() },
        };
      });

      it('does nothing if tab.disabled = true', () => {
        Tabs.methods.open.call(context, { disabled: true, value: 'bar' });

        expect(context.$el.dispatchEvent).not.toHaveBeenCalled();
      });

      it('does nothing if tab.value = currentTab', () => {
        Tabs.methods.open.call(context, { value: 'foo' });

        expect(context.$el.dispatchEvent).not.toHaveBeenCalled();
      });

      it('creates a "click-tab" custom event with the correct properties', () => {
        Tabs.methods.open.call(context, { value: 'bar' });

        expect(customEventConstructorSpy).toHaveBeenCalledWith('click-tab', {
          detail: 'bar',
          bubbles: true,
          composed: true,
        });
      });

      it('calls $el.dispatchEvent with the newly created event', () => {
        Tabs.methods.open.call(context, { value: 'bar' });

        expect(context.$el.dispatchEvent).toHaveBeenCalledWith({ name: 'click-tab' });
      });
    });

    describe('#linkClass', () => {
      beforeEach(() => {
        context = { currentTab: 'foo' };
      });

      it('returns the tab state classes if value != currentTab and disabled=true', () => {
        result = Tabs.methods.linkClass.call(context, { value: 'bar', disabled: true });

        expect(result).toEqual({
          'tab_active': false,
          'tab_disabled': true,
        });
      });

      it('returns the tab state classes if value == currentTab and disabled=false', () => {
        result = Tabs.methods.linkClass.call(context, { value: 'foo', disabled: false });

        expect(result).toEqual({
          'tab_active': true,
          'tab_disabled': false,
        });
      });
    });
  });

  describe('lifecycle hooks', () => {
    describe('#mounted', () => {
      beforeEach(() => {
        context = {
          currentTab: '',
          tabs: [{ value: 'foo' }, { value: 'bar' }],
          open: jest.fn(),
        };
      });

      it('does nothing if currentTab is truthy', () => {
        context.currentTab = 'bar';

        Tabs.mounted.call(context);

        expect(context.open).not.toHaveBeenCalled();
      });

      it('does nothing if currentTab is falsy but there are no tabs', () => {
        context.tabs = [];

        Tabs.mounted.call(context);

        expect(context.open).not.toHaveBeenCalled();
      });

      it('calls open with the first tab otherwise', () => {
        Tabs.mounted.call(context);

        expect(context.open).toHaveBeenCalledWith({ value: 'foo' });
      });
    });
  });
});
