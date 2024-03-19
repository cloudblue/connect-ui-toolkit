import $injector from '~core/injector';
import registerWidget from '~core/registerWidget';

export { default as Tabs } from '~widgets/tabs/widget.vue';
export { default as Tab } from '~widgets/tab/widget.vue';
export { default as Pad } from '~widgets/pad/widget.vue';
export { default as Card } from '~widgets/card/widget.vue';
export { default as Icon } from '~widgets/icon/widget.vue';
export { default as View } from '~widgets/view/widget.vue';
export { default as Navigation } from '~widgets/navigation/widget.vue';
export { default as Status } from '~widgets/status/widget.vue';
export { default as Select } from '~widgets/select/widget.vue';
export { default as Textfield } from '~widgets/textfield/widget.vue';
export { default as Table } from '~widgets/table/widget.vue';
export { default as ComplexTable } from './widgets/complexTable/widget.vue';
export { default as Button } from '~widgets/button/widget.vue';
export { default as Menu } from '~widgets/menu/widget.vue';

export { default as store } from '~core/store';
export { default as bus } from '~core/eventBus';

export { connectPortalRoutesDict as connectPortalRoutes } from '~constants/portal-routes';

export default (widgets = {}, options = {}) => {
  for (const widget in widgets) registerWidget(widget, widgets[widget]);

  return $injector(options);
};
