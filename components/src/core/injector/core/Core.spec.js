import Core from './Core';

describe('Core', () => {
  let core;

  beforeEach(() => {
    core = new Core();
  });

  describe('initial sets', () => {
    it.each([
      ['id', null],
      ['state', {}],
      ['listeners', {}],
      ['watchers', {}],
    ])('should set %j to %j', (key, val) => {
      expect(core[key]).toEqual(val);
    });
  });

  describe('#assign()', () => {
    it.each([
      [null, null],
      [{ test: 123 }, null],
      [null, { test: 123 }],
    ])('should do nothing while $state is %j and data is %j', (state, data) => {
      global.Object.keys = vi.fn(Object.keys);
      core.state = state;
      core.assign(data);

      expect(Object.keys).not.toHaveBeenCalledWith(data);
    });

    it('should assign passed data to a state', () => {
      core.state = {
        test: 'TEST',
      };

      core.assign({
        test: 'NEW_TEST',
        foo: 'bar',
      });

      expect(core.state).toEqual({
        test: 'NEW_TEST',
      });
    });

    it('should launch proper watchers', () => {
      core.state = {
        test: 'TEST',
        foo: 'BAR',
      };

      core.watchers = {
        test: [vi.fn()],
      };

      core.assign({
        test: 'NEW_TEST',
        foo: 'bar',
      });

      expect(core.watchers.test[0]).toHaveBeenCalled();
    });

    it('should launch all watchers with "*" key', () => {
      core.state = {
        test: 'TEST',
        foo: 'BAR',
      };

      core.watchers = {
        '*': [vi.fn()],
      };

      core.assign({
        test: 'NEW_TEST',
        foo: 'bar',
      });

      expect(core.watchers['*'][0]).toHaveBeenCalled();
    });
  });
});
