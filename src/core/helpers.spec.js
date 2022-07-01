import {
  fromKeys,
  clone,
  has,
} from './helpers';

describe('fromKeys()', () => {
  it('should create object from list of keys', () => {
    expect(fromKeys(['a', 'b', 'c'])).toEqual({
      a: null,
      b: null,
      c: null,
    });
  });
});

describe('clone', () => {
  it('should create top-level copy of an object', () => {
    const obj = { prop: 'Lorem ipsum' };
    const trg = clone(obj);

    trg.prop = 'CHANGED';

    expect(obj.prop).toBe('Lorem ipsum');
    expect(trg.prop).toBe('CHANGED');
  });
});

describe('has', () => {
  it('should check if object has an own property of key', () => {
    expect(has('prop', { prop: undefined })).toBeTruthy();
  });

  it('should check if object has an own property of key', () => {
    expect(has('prop1', { prop: undefined })).toBeFalsy();
  });
});