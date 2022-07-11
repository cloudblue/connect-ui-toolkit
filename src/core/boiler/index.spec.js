import createBoiler from '.';
import widgetFactory from './core/widgetFactory';

jest.mock('./core/widgetFactory', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn(($plugin, component, $store, $settings) => ({
    $plugin,
    component,
    $store,
    $settings,
  })),
}));

describe('createBoiler', () => {
  let boiler;

  beforeEach(() => {
    boiler = createBoiler();

    global.customElements.define = jest.fn();
  });

  it('mount() should throw if no plugin installed', () => {
    let err;

    try {
      boiler.mount('test-elem', {});
    } catch (e) {
      err = e;
    }

    expect(err).toEqual(new Error('To mount a component we need a plugin'));
  });

  it('plugin() should set plugin', () => {
    boiler.plugin('SOME_PLUGIN');
    boiler.mount('test-elem', {});

    expect(widgetFactory.mock.calls[0][0]).toBe('SOME_PLUGIN');
  });

  it('mount() should pass proper component', () => {
    boiler.plugin('SOME_PLUGIN');
    boiler.mount('test-elem', { foo: 'bar' });

    expect(widgetFactory.mock.calls[0][1]).toEqual({ foo: 'bar' });
  });

  it('store() should set store', () => {
    boiler.plugin('SOME_PLUGIN');
    boiler.store('STORE');
    boiler.mount('test-elem', {});

    expect(widgetFactory.mock.calls[0][2]).toBe('STORE');
  });

  it('should set noop function as default for store', () => {
    boiler.plugin('SOME_PLUGIN');
    boiler.mount('test-elem', {});

    expect(widgetFactory.mock.calls[0][2]()).toBeUndefined();
  });

  it('setup() should assign data on settngs', () => {
    boiler.plugin('SOME_PLUGIN');
    boiler.setup({ foo: 'FOO' });
    boiler.setup({ bar: 'BAR' });
    boiler.setup({ bar: 'BUZ' });

    boiler.mount('test-elem', {});

    expect(widgetFactory.mock.calls[0][3]).toEqual({
      foo: 'FOO',
      bar: 'BUZ',
    });
  });

  it('should add custom element properly', () => {
    boiler.plugin('SOME_PLUGIN');
    boiler.store('STORE');
    boiler.setup({ foo: 'bar' });

    boiler.mount('test-elem', { buz: 'BUZZZ' });

    expect(customElements.define).toHaveBeenCalledWith('test-elem', {
      $plugin: 'SOME_PLUGIN',
      component: { buz: 'BUZZZ' },
      $store: 'STORE',
      $settings: { foo: 'bar' },
    });
  });
});