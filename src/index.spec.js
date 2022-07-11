import createApp from '.';

import createBoiler from './core/boiler';
import busVuePlugin from './core/boiler-plugins/bus-vue-plugin';

let mockBoiler;

jest.mock('./core/bus', () => ({
  __esModule: true,
  default: jest.fn(() => 'BUS'),
}));

jest.mock('./core/injector', () => ({
  __esModule: true,
  default: jest.fn(() => 'INJECTOR'),
}));

jest.mock('./core/boiler', () => ({
  __esModule: true,
  default: jest.fn(() => mockBoiler),
}));

jest.mock('./core/boiler-plugins/vue-plugin', () => ({
  __esModule: true,
  default: 'PLUGIN',
}));

jest.mock('./core/boiler-plugins/bus-vue-plugin', () => ({
  __esModule: true,
  default: jest.fn(() => 'STORE'),
}));

describe('createApp', () => {
  beforeEach(() => {
    mockBoiler = {
      plugin: jest.fn(),
      store: jest.fn(),
      setup: jest.fn(),
      mount: jest.fn(),
    };
  });

  it('should create boiler app', () => {
    createApp({});
    expect(createBoiler).toHaveBeenCalled();
  });

  it('should setup plugin', () => {
    createApp({});
    expect(mockBoiler.plugin).toHaveBeenCalledWith('PLUGIN');
  });

  it('should setup busVuePlugin with a bus', () => {
    createApp({});
    expect(busVuePlugin).toHaveBeenCalledWith('BUS');
  });

  it('should boiler.store with busVuePlugin', () => {
    createApp({});
    expect(mockBoiler.store).toHaveBeenCalledWith('STORE');
  });

  it('should provide setup', () => {
    createApp({ foo: 'bar', fuz: 'buz' });
    expect(mockBoiler.setup).toHaveBeenCalledWith({ customs: ['foo', 'fuz'] });
  });

  it.each([
    ['foo', 'bar'],
    ['fuz', 'buz'],
  ])('boiler.mount should be called for %j with %j', (tag, component) => {
    createApp({ foo: 'bar', fuz: 'buz' });
    expect(mockBoiler.mount).toHaveBeenCalledWith(tag, component);
  });

  it('should return an $injector as a result', () => {
    expect( createApp({ foo: 'bar', fuz: 'buz' })).toBe('INJECTOR');
  });
});