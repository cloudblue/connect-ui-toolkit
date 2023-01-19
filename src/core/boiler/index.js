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

     const widget = component;
     if (widget.extends) {
      widget.props = {...widget.props, ...widget.extends.props};
     }

      customElements.define(name, widgetFactory(
        $plugin,
        widget,
        $store,
        $settings
      ));
    },
  };
};



