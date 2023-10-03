import $injector from './core/injector';
import registerWidget from './core/registerWidget';

import tabs from './widgets/tabs/widget.vue';
import tab from './widgets/tab/widget.vue';
import pad from './widgets/pad/widget.vue';
import card from './widgets/card/widget.vue';
import view from './widgets/view/widget.vue';
import navigation from './widgets/navigation/widget.vue';

import _store from './core/store';
import _bus from './core/eventBus';

export const Tabs = tabs;
export const Tab = tab;
export const Pad = pad;
export const Card = card;
export const View = view;
export const Navigation = navigation;

export const bus = _bus;
export const store = _store;

export default (widgets = {}, options = {}) => {
  for (const widget in widgets) registerWidget(widget, widgets[widget]);

  return $injector(options);
};
