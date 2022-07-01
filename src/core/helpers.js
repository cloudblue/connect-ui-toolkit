export const fromKeys = (ks) => ks.reduce((acc, k) => { acc[k] = null; return acc; }, {});

export const clone = v => JSON.parse(JSON.stringify(v));

export const has = (prop, obj) => Object.keys(obj).includes(prop);

export const call = (fn, ...args) => fn(...args);