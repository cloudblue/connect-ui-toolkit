import { defineCustomElement } from 'vue';

import { busMixin } from '~core/eventBus';

import { storeMixin } from '~core/store';

import { injectorMixin } from '~core/injector';

export default (name, component) => {
  if (!component.mixins) component.mixins = [];
  component.mixins.push(injectorMixin, busMixin, storeMixin);

  if (!customElements.get(name)) customElements.define(name, defineCustomElement(component));
};
