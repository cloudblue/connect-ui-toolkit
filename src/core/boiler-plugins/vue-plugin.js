import { createApp } from 'vue/dist/vue.esm-bundler';
import {
  reactive,
} from 'vue';

export const rootEmit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

export const observe = component => {
  return Object.keys(component.props || {});
}

export const create = (boiler, component, storeInstaller) => {
  const customs = [...(boiler?.settings?.customs || []), 'boiler-content'];
  const state = reactive(boiler.getState());
  const app = createApp({
    template: `<widget v-bind="state"><boiler-content></boiler-content></widget>`,
    computed: { state: () => state },
  });

  storeInstaller(app);
  app.config.unwrapInjectedRef = true;
  app.config.compilerOptions.isCustomElement = t => customs.includes(t);
  app.component('widget', component);
  app.provide('$boiler', boiler);
  app.provide('$injector', (type, data) => rootEmit('$injector', { type, data }));

  return {
    watch: (prop, newVal) => (state[prop] = newVal),
    mount: (el) => app.mount(el),
    unmount: () => app.unmount(),
  }
}

export default {
  create,
  observe,
};
