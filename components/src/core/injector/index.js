import Core from './core/Core.js';
import injectorFactory from './core/injectorFactory.js';
import launch from './core/launcher.js';

export const injectorMixin = {
  methods: {
    $injector(type, data) {
      window.dispatchEvent(new CustomEvent('$injector', { detail: { type, data } }));
    },
  },
};

export default async (options = {}) => {
  const core = new Core();
  const injector = injectorFactory(core);
  await launch(injector, core, options);

  return injector;
};
