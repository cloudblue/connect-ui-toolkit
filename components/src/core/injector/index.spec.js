import createInjector from '.';

import Core from './core/Core';
import injectorFactory from './core/injectorFactory';
import launcher from './core/launcher';

jest.mock('./core/Core', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({ core: 'CORE' })),
}));

jest.mock('./core/injectorFactory', () => ({
  __esModule: true,
  default: jest.fn(() => 'INJECTOR'),
}));

jest.mock('./core/launcher', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

describe('createInjector', () => {
  beforeEach(() => {
    createInjector();
  });

  it('should create a Core', () => {
    expect(Core).toHaveBeenCalled();
  });

  it('should create an injector', () => {
    expect(injectorFactory).toHaveBeenCalledWith({ core: 'CORE' });
  });

  it('should launch an injector', () => {
    expect(launcher).toHaveBeenCalledWith('INJECTOR', { core: 'CORE' }, {});
  });
});

describe('createInjector on launcher error', () => {
  beforeEach(() => {
    launcher.mockImplementation(() => Promise.reject(new Error('ERROR')));
  });

  it('should throw an error', () => {
    expect(createInjector()).rejects.toThrow('ERROR');
  });
});
