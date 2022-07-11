import bus, { $module } from '.';
import vue from 'vue';

jest.mock('vue', () => ({
  reactive: jest.fn(v => v),
}))

describe('$module', () => {
  describe('on call should', () => {
    let result;

    beforeEach(() => {
      result = $module({ state: 'ABC', actions: { a: 'A', b: 'B' }})
    });

    it('make state reactive', () => {
      expect(vue.reactive).toHaveBeenCalledWith('ABC')
    });

    it('return same data', () => {
      expect(result).toEqual({ state: 'ABC', actions: { a: 'A', b: 'B' }});
    });
  });

  describe('should set defaults', () => {
    it.each([
      [undefined, undefined, { state: {}, actions: {} }],
      ['FOO', undefined, { state: 'FOO', actions: {} }],
      [undefined, 'BAR', { state: {}, actions: 'BAR' }],
      ['FOO', 'BAR', { state: 'FOO', actions: 'BAR' }],
    ])('when state is %j and actions %j should return %j', (state, actions, result) => {
      expect($module({ state, actions })).toEqual(result);
    });
  });
});

describe('bus', () => {
  let $bus;

  describe('with incorrect module', () => {
    it('should throw an error when module has no name', () => {
      try {
        $bus = bus();
        $bus.add({ state: {}, actions: {} });
      } catch (e) {
        expect(e.message).toBe('Module should have a mandatory "name" property');
      }
    });
  });

  describe('with correct module', () => {
    beforeEach(() => {
      $bus = bus();

      $bus.add({
        name: 'test',

        state: {
          foo: 'FOO',
          bar: 'BAR'
        },

        actions: {
          toggle() {
            this.state.foo = 'BAR';
            this.state.bar = 'FOO';
          },
        },
      });
    });

    describe('#watch()', () => {
      it('should return full state by default', () => {
        expect($bus.watch('test')).toEqual({ foo: 'FOO', bar: 'BAR' });
      });

      it('should return full state when property "*" is passed', () => {
        expect($bus.watch('test', '*')).toEqual({ foo: 'FOO', bar: 'BAR' });
      });

      it('should return property of state when property is passed', () => {
        expect($bus.watch('test', 'foo')).toBe('FOO');
      });
    });

    describe('#commit()', () => {
      it('should set value of property', () => {
        $bus.commit('test', 'foo', 'BAR');

        expect($bus.watch('test', 'foo')).toBe('BAR');
      });
    });

    describe('#dispatch()', () => {
      it('should trigger an action of a module', () => {
        $bus.dispatch('test', 'toggle');

        expect($bus.watch('test', '*')).toEqual({ foo: 'BAR', bar: 'FOO' });
      });
    });

    describe('#listen', () => {
      it('should put subscribers for event ', () => {
        let cb1 = jest.fn();
        $bus.listen('test', 'foo', cb1);
        $bus.commit('test', 'foo', 'bar');
        expect(cb1).toHaveBeenCalledWith('bar');
      });

      it('should add new subscribers for existing group', () => {
        let cb1 = jest.fn();
        let cb2 = jest.fn();
        $bus.listen('test', 'foo', cb1);
        $bus.listen('test', 'foo', cb2);
        $bus.commit('test', 'foo', 'bar');
        expect(cb2).toHaveBeenCalledWith('bar');
      });
    });
  });
});

