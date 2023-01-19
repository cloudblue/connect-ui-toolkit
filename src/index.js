import $bus from './core/bus';
import $injector from './core/injector';
import createBoiler from './core/boiler';
import boilerVuePlugin from './core/boiler-plugins/vue-plugin';
import busVuePlugin from './core/boiler-plugins/bus-vue-plugin';

import tabs from './widgets/tabs/widget.vue';
import tab from './widgets/tab/widget.vue';
import pad from './widgets/pad/widget.vue';
import card from './widgets/card/widget.vue';

export const Tabs = tabs;
export const Tab = tab;
export const Pad = pad;
export const Card = card;

export default (widgets = {}, options = {}) => {
  const boiler = createBoiler();
  boiler.plugin(boilerVuePlugin);
  boiler.store(busVuePlugin($bus()));
  boiler.setup({ customs: Object.keys(widgets) });

  for (const widget in widgets) boiler.mount(widget, widgets[widget]);

  return $injector(options);
};
