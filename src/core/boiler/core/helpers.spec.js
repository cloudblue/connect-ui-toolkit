import {
  callAll,
  noop,
  isSimple,
  equals,
  $pickAttributes,
  $updateAttribute,
  $catch,
  $emit,
} from './helpers';

describe('noop()', () => {
  it('should return nothing when called', () => {
    expect(noop()).toBeUndefined();
  });
});

describe('isSimple', () => {
  it.each([
    ['', true],
    ['abc', true],
    [true, true],
    [false, true],
    [123, true],
    [Infinity, true],
    [null, true],
    [undefined, true],
    [{}, false],
    [{ foo: 'bar' }, false],
    [[], false],
    [[1, 2, 3], false],
  ])('%j is simple? %j', (val, res) => {
    expect(isSimple(val)).toBe(res);
  });
});

describe('equals()', () => {
  it.each([
    ['', '', true],
    ['123', '', false],
    ['123', '123', true],
    [true, true, true],
    [true, false, false],
    [123, 321, false],
    [123, 123, true],
    [123, '123', false],
    [0, false, false],
    [null, null, true],
    [undefined, undefined, true],
    [undefined, null, false],
    [{}, {}, true],
    [{ foo: 'bar', bar: 'foo' }, { bar: 'foo', foo: 'bar' }, true],
    [{ foo: { bar: 'buz' } }, { foo: { bar: 'buz' } }, true],
    [{ foo: { bar: 'fuz' } }, { foo: { bar: 'buz' } }, false],
    [[], [], true],
    [['foo'], ['bar'], false],
    [['foo'], ['foo'], true],
    [[{ foo: { bar: 'buz' } }], [{ foo: { bar: 'buz' } }], true],
    [[{ foo: { bar: 'fuz' } }], [{ foo: { bar: 'buz' } }], false],
    [new Date(1234567), new Date(1234567), true],
    [new Date(123), new Date(321), false],
    [() => 123, () => 321, false],
    [() => 123, () => 123, true],
  ])('%j equals %j? %j', (a, b, res) => {
    expect(equals(a, b)).toBe(res);
  });
});

describe('callAll()', () => {
  it('should call all functions in list with passed arguments', () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    const cb3 = jest.fn();
    const cb4 = jest.fn();
    const cb5 = jest.fn();

    callAll([cb1, 'not a function', cb2, cb3, cb4, cb5], 'foo', 'bar', 'buz');

    expect(cb1).toHaveBeenCalledWith('foo', 'bar', 'buz');
    expect(cb2).toHaveBeenCalledWith('foo', 'bar', 'buz');
    expect(cb3).toHaveBeenCalledWith('foo', 'bar', 'buz');
    expect(cb4).toHaveBeenCalledWith('foo', 'bar', 'buz');
    expect(cb5).toHaveBeenCalledWith('foo', 'bar', 'buz');
  });
});

describe('$pickAttributes()', () => {
  it('should call #getAttribute for each passed attribute', () => {
    const getAttribute = jest.fn();
    $pickAttributes({ getAttribute }, ['foo', 'bar', 'buz'])
    expect(getAttribute.mock.calls).toEqual([['foo'], ['bar'], ['buz']])
  });

  it('should call #getAttribute for each passed attribute', () => {
    const getAttribute = jest.fn(v => v.toUpperCase());

    expect($pickAttributes(
      { getAttribute },
      ['foo', 'bar', 'buz'],
      )).toEqual({ foo: 'FOO', bar: 'BAR', buz: 'BUZ' });
  });
});

describe('$updateAttribute()', () => {
  let element;

  beforeEach(() => {
    element = {
      getAttribute: jest.fn(attr => element[attr]),

      setAttribute: jest.fn((attr, val) => {
        element[attr] = val;
      }),
    };
  });

  it('should early return when trying to set current value', () => {
    element.foo = 'bar';
    $updateAttribute(element, 'foo', 'bar');
    expect(element.setAttribute).not.toHaveBeenCalled();
  });

  it('should setAttribute if value is new', () => {
    element.foo = 'bar';
    $updateAttribute(element, 'foo', 'buz');
    expect(element.setAttribute).toHaveBeenCalledWith('foo', 'buz');
  });
});

describe('$catch()', () => {
  let element;
  let callback;
  let handler;
  let event;

  beforeEach(() => {
    handler = jest.fn();

    event = {
      stopPropagation: jest.fn(),
      detail: {
        input: 'FOO',
      },
    };

    element = {
      addEventListener: jest.fn((n, cb) => {
        callback = cb;
      }),
    };

    $catch(element, 'foo', handler);
    callback(event);
  });

  it('should add event listner for proper name', () => {
    expect(element.addEventListener).toHaveBeenCalledWith('foo', callback);
  });

  it('should stop event propagation when catched', () => {
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should call handler with detail.input when catched', () => {
    expect(handler).toHaveBeenCalledWith('FOO');
  });
});

describe('$emit()', () => {
  let element;

  beforeEach(() => {
    global.CustomEvent = jest.fn().mockImplementation(() => ({ event: 'FOO:EVENT' }));
    
    element = {
      dispatchEvent: jest.fn(),
    };
    
    $emit(element, 'foo', 'FOOBAR');
  });

  it('should create correct custom event', () => {
    expect(CustomEvent).toHaveBeenCalledWith('foo', { bubbles: true, detail: { input: 'FOOBAR' } } )
  });

  it('should dispatch created event', () => {
    expect(element.dispatchEvent).toHaveBeenCalledWith({ event: 'FOO:EVENT' });
  });
});