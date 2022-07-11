import { createApp } from 'vue/dist/vue.esm-bundler';
import {
  reactive,
} from 'vue';

export const rootEmit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

export const observe = component => {
  return Object.keys(component.props || {});
}

export const create = (boiler, component, storeInstaller) => {
  const customs = [...(boiler?.settings?.customs || []), 'content'];
  const state = reactive(boiler.getState());
  const app = createApp({
    template: '<widget v-bind="state"></widget>',
    computed: { state: () => state },
  });

  storeInstaller(app);
  app.config.unwrapInjectedRef = true;
  app.config.compilerOptions.isCustomElement = t => customs.includes(t);
  app.component('widget', component);
  app.component('content', { template: boiler.content });
  app.provide('$boiler', boiler);
  app.provide('$injector', (type, data) => rootEmit('$injector', { type, data }));

  return {
    watch: (prop, newVal) => (state[prop] = newVal),
    mount: () => app.mount(boiler.element),
    unmount: () => app.unmount(),
  }
}

export default {
  create,
  observe,
};
