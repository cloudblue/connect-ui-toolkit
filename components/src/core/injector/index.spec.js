import createInjector from '.';

import Core from './core/Core';
import injectorFactory from './core/injectorFactory';
import launcher from './core/launcher';

vi.mock('./core/Core', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({ core: 'CORE' })),
}));

vi.mock('./core/injectorFactory', () => ({
  __esModule: true,
  default: vi.fn(() => 'INJECTOR'),
}));

vi.mock('./core/launcher', () => ({
  __esModule: true,
  default: vi.fn(() => Promise.resolve()),
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

  it('should throw an error', async () => {
    let error;

    try {
      await createInjector();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual('ERROR');
  });
});
