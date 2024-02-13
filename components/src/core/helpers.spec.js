import {
  clone,
  has,
  path,
} from './helpers';


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
  it('returns true if the object has the property', () => {
    expect(has('prop', { prop: undefined })).toBeTruthy();
  });

  it('returns false if the object does not have the property', () => {
    expect(has('prop1', { prop: undefined })).toBeFalsy();
  });
});

describe('path', () => {
  it('should return value of given path', () => {
    expect(path(['a', 'b', 'c'], { a: { b: { c: 'ABC' } } })).toBe('ABC')
  });

  it('should return value of given path even for arrays', () => {
    expect(path(['a', 0, 'c'], { a: [{ c: 'ABC' }] })).toBe('ABC')
  });

  it('should return undefined for unexisting path', () => {
    expect(path(['a', 'b', 'c'], { a: { c: { b: 'ABC' } } })).toBeUndefined()
  });

  it('should return self for not an object', () => {
    // (Yes it`s weird. Don`t use it this way)
    expect(path(['a', 'b', 'c'], 'ABC')).toBe('ABC');
  });

  it('should return self if some nested path resolves into not an object', () => {
    // (This explains previous part a little bit - A little less strict as ramda once)
    expect(path(['a', 'b', 0], { a: { b: 'ABC' } })).toBe('ABC');
  });
});
