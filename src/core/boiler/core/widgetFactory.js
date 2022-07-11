import {
  $updateAttribute,
  noop,
} from './helpers';

import boilerInterface from './boilerInterface';

export default (plugin, component, storeInstaller, settings) => class Widget extends HTMLElement {
  constructor() {
    super();

    this.$app = null;
    this.$settings = settings;

    const {
      watch = noop,
      mount = noop,
      unmount = noop,
    } = plugin.create(boilerInterface(this, component, plugin), component, storeInstaller);

    this.mount = mount;
    this.unmount = unmount;
    this.watch = watch;
  }

  connectedCallback() {
    plugin.observe(component).forEach((attr) => {
      this.addEventListener(`update:${attr}`, (e) => {
        let handler = noop;
        let raw = this.getAttribute( `on${attr}` );

        $updateAttribute(this, attr, e.detail);

        if (typeof raw === 'function') handler = raw;
        else if (raw) handler = (new Function(`return ${raw}`))();

        handler(e.detail);
      });
    });

    this.addEventListener('update', (e) => {
      let handler = noop;
      let raw = this.getAttribute( `onUpdate` );

      if (typeof raw === 'function') handler = raw;
      else if (raw) handler = (new Function(`return ${raw}`))();

      handler(e.detail);
    });

    this.$app = this.mount();
  }

  disconnectedCallback() {
    this.unmount(this.$app);
  }

  static get observedAttributes() {
    return plugin.observe ? plugin.observe(component) : [];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (plugin.observe && plugin.observe(component).includes(attr)) {
      this.watch(attr, newValue, oldValue);
    }
  }
}
