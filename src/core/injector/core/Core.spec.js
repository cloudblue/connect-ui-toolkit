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
      global.Object.keys = jest.fn(Object.keys);
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
      })
    });

    it('should launch proper watchers', () => {
      core.state = {
        test: 'TEST',
        foo: 'BAR',
      };

      core.watchers = {
        test: [jest.fn()],
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
        '*': [jest.fn()],
      };

      core.assign({
        test: 'NEW_TEST',
        foo: 'bar',
      });

      expect(core.watchers['*'][0]).toHaveBeenCalled();
    });
  });

  describe('#size', () => {
    it('should return document size in proper format', () => {
      jest.spyOn(global.document.documentElement, 'scrollHeight', 'get').mockReturnValue(100)
      jest.spyOn(global.document.documentElement, 'scrollWidth', 'get').mockReturnValue(300)
      jest.spyOn(global.document.documentElement, 'offsetHeight', 'get').mockReturnValue(200)
      jest.spyOn(global.document.documentElement, 'offsetWidth', 'get').mockReturnValue(200)

      expect(core.size()).toEqual({
        width: 300,
        height: 200,
      });
    });
  });
});