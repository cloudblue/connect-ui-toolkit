import {
  $updateAttribute,
  noop,
  hex,
} from './helpers';

import boilerInterface from './boilerInterface';

export default (plugin, component, storeInstaller, settings) => class Widget extends HTMLElement {
  constructor() {
    super();

    this.$id = hex(8);
    this.$app = null;
    this.$settings = settings;

    // We need shadow dom to use slot's mechanics for element contents
    // In fact it allows us to have content that is operated by an external app
    // in own lifecycle but is displayed inside our app
    this.$shadow = this.attachShadow({ mode: 'open' });
    this.$container = document.createElement('container');
    this.$container.setAttribute('id', `app_${this.$id}`);
    this.$slot = document.createElement('slot');
    this.$slot.setAttribute('id', `slot_${this.$id}`);

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

    // Ugly-ugly solution to make Shadow DOM transparent in terms of styling
    // If you have ANY more appropriate idea - please contact me
    const styles = document.querySelectorAll('style');
    styles.forEach((el) => {
      this.$shadow.appendChild(el.cloneNode(true));
    });

    // Default slot positioning -
    // covers situation when mount doesn't wipe out content nodes
    this.$container.appendChild(this.$slot);
    this.$shadow.appendChild(this.$container);

    // Mount an app -
    // Very often wipes out content and intercepts control of content
    this.$app = this.mount(this.$container);

    // For such cases - when slot was wiped out
    // we recreate it on demand on requested place.
    // To be more specific - replace an element 'boiler-content' placed inside app template
    if (!this.$shadow.getElementById(`slot_${this.$id}`)) {
      const placeholder = this.$shadow.querySelector('boiler-content');
      if (!placeholder) return;
      placeholder.replaceWith(this.$slot);
    }
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
