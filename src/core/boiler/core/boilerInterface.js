import {
  callAll,
  $pickAttributes,
  $updateAttribute,
  $catch,
  $emit,
} from './helpers';

export default (element, component, plugin) => {
  const subscribers = {};
  const observed = plugin.observe(component);
  const settings = element?.$settings;
  const content = element?.innerHTML;

  return {
    element,
    observed,
    settings,
    content,

    // Parent allows subscription
    publishes(name) {
      $catch(
        element,
        `$subscribe:${name}`,
        (handler) => {
          if (!subscribers[name]) subscribers[name] = [];
          subscribers[name].push(handler);
        },
      );
    },

    // Child subscribes for parent (Listen up)
    subscribe(name, handler) {
      $emit(element, `$subscribe:${name}`, handler);
    },

    // Parent publishes for children (Event down)
    publish(name, data) {
      if (!subscribers[name]) return;
      callAll(subscribers[name], data);
    },

    // Parent subscribes for child (Listen down)
    listen(name, handler) {
      $catch(element, `$dispatch:${name}`, handler);
    },

    // Child emits to parent (Event up)
    dispatch(name, data) {
      $emit(element, `$dispatch:${name}`, data);
    },

    // Apply custom style for a wrapping element
    style(style) {
      const stylesObj = typeof style === 'function' ? style(element) : style;

      for (const prop in stylesObj) element.style[prop] = stylesObj[prop];
    },

    getState(defaults = {}) {
      return { ...$pickAttributes(element, observed), ...defaults };
    },

    // Update attributes from inside an app
    raiseState(state) {
      Object.keys(state).forEach((attr) => {
        if (observed.includes(attr)) {
          $updateAttribute(element, attr, state[attr]);

          const event = new CustomEvent(`update:${attr}`, { bubbles: false, detail: state[attr] });
          element.dispatchEvent(event);
        }
      });

      const event = new CustomEvent('update', { bubbles: false, detail: $pickAttributes(element, observed) });
      element.dispatchEvent(event);
    },
  };
}
