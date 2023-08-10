import {
  call,
  has,
} from '~core/helpers';

export default class {
  constructor() {
    this.id = null;
    this.state = {};
    this.listeners = {};
    this.watchers = {};
  }

  assign(data) {
    if (!this.state || !data) return;

    Object.keys(data).forEach((k) => {
      if (has(k, this.state)) this.state[k] = data[k];
      if (has(k, this.watchers)) this.watchers[k].forEach(call);
    });

    if (has('*', this.watchers)) this.watchers['*'].forEach(call);
  }

  size() {
    return {
      height: Math.max(document.documentElement.offsetHeight, document.documentElement.scrollHeight),
      width: Math.max(document.documentElement.offsetWidth, document.documentElement.scrollWidth),
    };
  }
}
