import { $bus, $embed, $injector } from '@';
import modules from '~modules';

import tabs from '~widgets/tabs/widget.vue';
import tab from '~widgets/tab/widget.vue';
import pad from '~widgets/pad/widget.vue';
import card from '~widgets/card/widget.vue'


export const Tabs = tabs;
export const Tab = tab;
export const Pad = pad;
export const Card = card;

export default (widgets) => {
  const bus = $bus();
  modules.forEach(bus.add);
  for (const widget in widgets) $embed(bus, widget, widgets[widget], Object.keys(widgets));

  return $injector();
};
