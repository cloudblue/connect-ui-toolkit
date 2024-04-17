/* eslint-disable vue/one-component-per-file */
import createApp from './index';
import injector from '~core/injector';
import registerWidget from '~core/registerWidget';

vi.mock('~core/injector', () => ({
  __esModule: true,
  default: vi.fn(() => 'app'),
}));

vi.mock('~core/registerWidget', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('#createApp function', () => {
  it('calls registerWidget with every widget passed', () => {
    createApp({ foo: 'Foo' });

    expect(registerWidget).toHaveBeenCalledWith('foo', 'Foo');
  });

  it('calls the injector with the options', () => {
    createApp({}, { foo: 'bar' });

    expect(injector).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('returns the result of the injector call', () => {
    const result = createApp();

    expect(result).toEqual('app');
  });
});
