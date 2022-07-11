import hash from 'object-hash';

export const noop = () => {};

export const isSimple = v => v === null || ['string', 'number', 'boolean', 'undefined'].includes(typeof v);

export const equals = (a, b) => {
  const simple = isSimple(a);
  if (simple) return a === b;
  else return hash(a) === hash(b);
};

export const callAll = (arr, ...args) => arr.forEach((fn) => {
  if (typeof fn === 'function') fn(...args)
});

export const $pickAttributes = (el, arr) => arr.reduce((acc, attr) => {
  acc[attr] = el.getAttribute(attr);

  return acc;
}, {});

export const $updateAttribute = (el, attr, val) => {
  if (equals(el.getAttribute(attr), val)) return;
  el.setAttribute(attr, val);
};

export const $catch = (el, name, handler) => {
  el.addEventListener(name, (e) => {
    // Event should only be handled once in this system
    e.stopPropagation();

    handler(e.detail.input);
  });
};

export const $emit = (el, name, input) => {
  const event = new CustomEvent(name, { bubbles: true, detail: { input } });
  el.dispatchEvent(event);
}