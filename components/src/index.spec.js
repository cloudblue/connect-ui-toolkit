import createApp from './index';
import injector from '~core/injector';
import registerWidget from '~core/registerWidget';


jest.mock('~core/injector', () => ({
  __esModule: true,
  default: jest.fn(() => 'app'),
}));

jest.mock('~core/registerWidget', () => ({
  __esModule: true,
  default: jest.fn(),
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
