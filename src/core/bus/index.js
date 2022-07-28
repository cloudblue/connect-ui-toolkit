import { reactive } from 'vue';
import { has, path } from '@/helpers';

export const $module = ({ state = {}, actions = {} }) => {
  return {
    state: reactive(state),
    actions,
  };
}

export default () => {
  /* No direct access to modules from outside! */
  const $modules = {};
  const $subscribers = {};

  return {
    /* Required to add new module to a bus */
    add(module) {
      if (!module.name) throw new Error('Module should have a mandatory "name" property');

      $modules[module.name] = $module(module);
    },

    /* Reactivity is granted by state itself - so it is just a simple getter on this level */
    /* Using "*" for property name will return whole module state at once  */
    watch(module, property = '*') {
      if (property === '*') return $modules[module].state

      return $modules[module].state[property];
    },

    /* Is basically a mutation - a setter for state property */
    /* As state reactivity is proxy-based it is sensitive for immutable ways to set */
    /* This is why instead of direct assignment in components is better to use this mutation */
    commit(module, property, value) {
      $modules[module].state[property] = value;
      (path([module, property], $subscribers) || []).forEach(cb => cb(value));
    },

    /* This one is for triggering actions */
    /* NB: I bind here module scope as a context - to allow some flexibility */
    /* However, if it won't be safe enough we may want to change it by passing
    /* 'commit' and 'dispatch' interface as it is done in vuex */
    dispatch(module, action, data) {
      return $modules[module].actions[action].call($modules[module], data, $modules);
    },

    /* For those who don't have vue reactivity */
    listen(module, prop, cb) {
      if (!has(module, $subscribers)) $subscribers[module] = {};
      if (!has(prop, $subscribers[module])) $subscribers[module][prop] = [];

      $subscribers[module][prop].push(cb);
    },
  };
};