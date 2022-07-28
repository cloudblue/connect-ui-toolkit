import widgetFactory from './core/widgetFactory';


export default () => {
  let $plugin;
  let $settings = {};
  let $store = () => {};

  return {
    plugin: plugin => ($plugin = plugin),
    store: store => ($store = store),
    setup: settings => Object.assign($settings, settings),

    mount(name, component) {
      if (!$plugin) throw new Error('To mount a component we need a plugin');

      customElements.define(name, widgetFactory(
        $plugin,
        component,
        $store,
        $settings
      ));
    },
  };
};



