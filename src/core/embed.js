import { createApp } from 'vue/dist/vue.esm-bundler';
import { reactive } from 'vue';
import { fromKeys } from './helpers';


export default (bus, name, component, customs = []) => {
  // TODO: Move all vue-related things into a separate generalised class which
  //  instances will implement interfaces for various frontend envs or so
  class Widget extends HTMLElement {
    // Everything generic should be done in constructor
    constructor() {
      super();

      this.$app = null;
      this.$subscribers = {};
      this.$state = reactive(fromKeys(component.$attrs || []));

      // Events emitter decorator
      this.$emit = (name, detail) => {
        const event = new CustomEvent(name, {
          bubbles: true,
          detail,
        });

        this.dispatchEvent(event);
      };

      // Events listener decorator
      this.$catch = (name, handler) => {
        this.addEventListener(name, (e) => {
          // Event should only be handled once in this system
          e.stopPropagation();

          handler(e.detail);
        });
      };

      // Parent allows whitelist of events to subscribe
      if (component?.$publishes?.length > 0) {
        component.$publishes.forEach((name) => {
          this.$catch(
            `$subscribe:${name}`,
            ({ handler }) => {
              if (!this.$subscribers[name]) this.$subscribers[name] = [];

              this.$subscribers[name].push(handler);
            },
          );
        });
      }
    }

    connectedCallback() {
      /* Pretty much Everything Vue-related is kept here */
      this.$app = createApp(component);
      this.$app.config.unwrapInjectedRef = true;
      this.$app.config.compilerOptions.isCustomElement =  t => {
        return [...customs, 'content'].includes(t);
      }

      this.$app.provide('$state', this.$state);
      this.$app.provide('$bus', bus);
      this.$app.provide('$injector', (type, data) => {
        window.dispatchEvent(new CustomEvent('$injector', { detail: { type, data } }));
      });

      // Parent emits to child
      this.$app.provide('$publish', (name, data) => {
        if (!component.$publishes.includes(name)) return;
        if (!this.$subscribers[name]) return;

        this.$subscribers[name].forEach(cb => cb(data))
      });

      // Child listens parent
      this.$app.provide('$subscribe', (name, handler) => {
        this.$emit(`$subscribe:${name}`, { handler });
      });

      // Child emits to parent
      this.$app.provide('$dispatch', (name, data) => {
        this.$emit(`$dispatch:${name}`, data);
      });

      // Parent listens child
      this.$app.provide('$listen', (name, handler) => {
        this.$catch(`$dispatch:${name}`, (data) => {
          handler(data)
        });
      });

      // Initiall attributes set initialization
      if (component.$attrs) {
        component.$attrs.forEach((attr) => {
          this.$state[attr] = this.getAttribute(attr);
        });
      }

      // We should preserve HTML of element to be mount it inside widgets vue app
      if (this.innerHTML) {
        this.content = this.innerHTML;

        this.$app.component('content', {
          template: this.content,
        })
      }

      // This solution allows to provide styles for custom html container without
      // binding to some unobvious CSS selectors. It also may be done by string containing
      // CSS code directly, but I like this approach more
      if (component.$style) {
        const style = typeof component.$style === 'function' ? component.$style(this) : component.$style;

        for (const prop in style) this.style[prop] = style[prop];
      }

      // Here is actually widgets app mounted
      this.$app.mount(this);
    }

    disconnectedCallback() {
      this.$app.unmount();
    }

    static get observedAttributes() {
      // You need that to observe attributes
      return component.$attrs;
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      // NOTE: We can implement this $attrs based on native Vue props
      // On one hand it will allow us to use native validation mechanism of Vue,
      if (component.$attrs.includes(attr)) this.$state[attr] = newValue;
    }
  }

  customElements.define(name, Widget);
};

