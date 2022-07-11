import boilerInterface from './boilerInterface';

import {
  callAll,
  $pickAttributes,
  $updateAttribute,
  $catch,
  $emit,
} from './helpers';

jest.mock('./helpers', () => ({
  $catch: jest.fn(),
  $emit: jest.fn(),
  $pickAttributes: jest.fn(() => ({ foo: 'bar' })),
  $updateAttribute: jest.fn(),
  callAll: jest.fn((arr, ...args) => arr.forEach((fn) => {
    if (typeof fn === 'function') fn(...args)
  })),
}));

describe('boilerInterface', () => {
  let create;
  let boiler;
  let element;
  let component;
  let plugin;

  beforeEach(() => {
    element = { element: 'ELEMENT' };
    component = { foo: 'bar' };
    plugin = {
      create: jest.fn(),
      observe: jest.fn(() => (['foo'])),
    };

    create = () => {
      boiler = boilerInterface(
        element,
        component,
        plugin,
      );
    };
  });

  it('should include passed element to output', () => {
    create();
    expect(boiler.element).toEqual({ element: 'ELEMENT' });
  });

  it('should set observed as a result of "observe" function', () => {
    create();
    expect(plugin.observe).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should set observed as a result of "observe" function', () => {
    create();
    expect(boiler.observed).toEqual(['foo']);
  });

  it('should grab settings from an element "$settings"', () => {
    element.$settings = { bar: 'buz' };
    create();
    expect(boiler.settings).toEqual({ bar: 'buz' });
  });

  it('should grab content from an element "innerHTML"', () => {
    element.innerHTML = '<foo>BAR</foo>';
    create();
    expect(boiler.content).toBe('<foo>BAR</foo>');
  });

  describe('#publishes()', () => {
    beforeEach(() => {
      create();
      boiler.publishes('foo');
    });

    it('should call $catch with correct element', () => {
      expect($catch.mock.calls[0][0]).toEqual({ element: 'ELEMENT' });
    });

    it('should provide correct listener name', () => {
      expect($catch.mock.calls[0][1]).toBe('$subscribe:foo');
    });

    it('should provide handler as a third argument', () => {
      expect($catch.mock.calls[0][2]).toEqual(expect.any(Function));
    });

    describe('#handler', () => {
      let handler;
      let callback;

      beforeEach(() => {
        callback = jest.fn();
        handler = $catch.mock.calls[0][2];
        handler(callback);
      });

      it('should add new subscribers set', () => {
        boiler.publish('foo', { foo: 'BAR' });
        expect(callback).toHaveBeenCalledWith({ foo: 'BAR' });
      });

      it('should enrich subscribers set when passed more callbacks', () => {
        const callback2 = jest.fn();
        handler(callback2);
        boiler.publish('foo', { foo: 'BAR' });
        expect(callback2).toHaveBeenCalledWith({ foo: 'BAR' });
      });
    });
  });

  describe('#subscribe()', () => {
    let callback;
    
    beforeEach(() => {
      callback = jest.fn();
      create();
      boiler.subscribe('foo', callback);
    });

    it('should emit from correct element', () => {
      expect($emit.mock.calls[0][0]).toEqual({ element: 'ELEMENT' });
    });

    it('should emit with correct name', () => {
      expect($emit.mock.calls[0][1]).toEqual('$subscribe:foo');
    });

    it('should emit with correct callback', () => {
      $emit.mock.calls[0][2]();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#publish()', () => {
    it('should early return when no subscribers', () => {
      create();
      boiler.publish();
      expect(callAll).not.toHaveBeenCalled();
    });

    describe('when subscribers are there', () => {
      let callback;
      let handler;

      beforeEach(() => {
        create();
        boiler.publishes('foo');

        callback = jest.fn();
        handler = $catch.mock.calls[0][2];

        handler(callback);
        boiler.publish('foo', { foo: 'bar' })
      });

      it('should call all corresponding subscribers', () => {
        expect(callAll).toHaveBeenCalledWith([callback], { foo: 'bar' });
      });

      it('should call all corresponding subscribers', () => {
        expect(callback).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });
  });

  describe('#listen()', () => {
    let callback;

    beforeEach(() => {
      callback = jest.fn();

      create();
      boiler.listen('foo', callback);
    });

    it('should catch on correct element', () => {
      expect($catch.mock.calls[0][0]).toEqual({ element: 'ELEMENT' })
    });

    it('should catch events with correct names', () => {
      expect($catch.mock.calls[0][1]).toBe('$dispatch:foo');
    });

    it('should handle events with correct callback', () => {
      const handler = $catch.mock.calls[0][2];
      handler();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#dispatch()', () => {
    beforeEach(() => {
      create();
      boiler.dispatch('foo', { foo: 'bar' });
    });

    it('should catch on correct element', () => {
      expect($emit.mock.calls[0][0]).toEqual({ element: 'ELEMENT' })
    });

    it('should catch events with correct names', () => {
      expect($emit.mock.calls[0][1]).toBe('$dispatch:foo');
    });

    it('should handle events with correct callback', () => {
      expect($emit.mock.calls[0][2]).toEqual({ foo: 'bar' });
    });
  });

  describe('#style()', () => {
    beforeEach(() => {
      element.style = { foo: 'bar' };
      create();
    });

    it('should set correct styles when called with object', () => {
      boiler.style({ marginLeft: 10 });

      expect(element.style).toEqual({ foo: 'bar', marginLeft: 10 });
    });

    it('should return styles as result of a function when passed so', () => {
      const callback = jest.fn();
      boiler.style(callback);

      expect(callback).toHaveBeenCalledWith({ element: 'ELEMENT', style: { foo: 'bar' } });
    });

    it('should return styles as result of a function when passed so', () => {
      const callback = () => ({ marginLeft: 10 });
      boiler.style(callback);

      expect(element.style).toEqual({ foo: 'bar', marginLeft: 10 });
    });
  });

  describe('#getState()', () => {
    let state;

    beforeEach(() => {
      $pickAttributes.mockReturnValueOnce({ foo: 'BAR' });
      create();
    });

    describe('without defaults', () => {
      beforeEach(() => {
        state = boiler.getState();
      });

      it('should call $pickAttributes for correct element', () => {
        expect($pickAttributes.mock.calls[0][0]).toEqual({ element: 'ELEMENT' });
      });

      it('should call $pickAttributes with correct attributes list', () => {
        expect($pickAttributes.mock.calls[0][1]).toEqual(['foo']);
      });

      it('should return result of $pickAttributes as a result', () => {
        expect(state).toEqual({ foo: 'BAR' })
      });
    });

    it('should assign defaults to returned object when provided', () => {
      state = boiler.getState({ buz: 'BUZ' });

      expect(state).toEqual({ foo: 'BAR', buz: 'BUZ' });
    });
  });

  describe('#raiseState()', () => {
    beforeEach(() => {
      global.CustomEvent = jest.fn().mockImplementation(() => ({
        event: 'FOO',
      }));
      element.dispatchEvent = jest.fn();
      create();
      boiler.raiseState({
        foo: 'BARBAR',
        bar: 'BUZBUZ',
      });
    });

    it('should call $updateAttribute with attr that is observed', () => {
      expect($updateAttribute).toHaveBeenCalledWith(element, 'foo', 'BARBAR');
    });

    it('should not call $updateAttribute with attr that is not observed', () => {
      expect($updateAttribute).not.toHaveBeenCalledWith(element, 'bar', 'BUZBUZ');
    });

    it('should create required event', () => {
      expect(CustomEvent.mock.calls[0]).toEqual(['update:foo', {
        bubbles: false,
        detail: 'BARBAR',
      }]);
    });

    it('should dispatch created event', () => {
      expect(element.dispatchEvent.mock.calls[0][0]).toEqual({ event: 'FOO' });
    });

    it('should create update event', () => {
      expect(CustomEvent.mock.calls[1]).toEqual(['update', {
        bubbles: false,
        detail: { foo: 'bar' },
      }]);
    });

    it('should dispatch created event', () => {
      expect(element.dispatchEvent.mock.calls[1][0]).toEqual({ event: 'FOO' });
    });
  });
});
