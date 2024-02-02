export const clone = v => JSON.parse(JSON.stringify(v));

export const has = (prop, obj) => Object.keys(obj).includes(prop);

export const path = ([h, ...t], o) => h === undefined || typeof o !== 'object' ? o : path(t, o[h]);

export const call = (fn, ...args) => fn(...args);
