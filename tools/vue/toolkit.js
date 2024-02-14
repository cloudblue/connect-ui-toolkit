import { inject, reactive } from 'vue';


export const toolkitPlugin = {
  /**
   * Installs the toolkit plugin, which can be accessed via 'this.$toolkit',
   * via Vue injection (options api: { inject: ['toolkit'] } or composition api: inject('toolkit'))
   * or via the useToolkit hook (const toolkit = useToolkit())
   *
   * @param {object} app – Vue instance
   * @param {object} toolkitInstance – Connect UI Toolkit instance
   */
  install: (app, toolkitInstance) => {
    const sharedContext = reactive({});

    toolkitInstance.watch(
      '*',
      (data = {}) => {
        Object.entries(data).forEach(([key, value]) => {
          sharedContext[key] = value;
        });
      },
      { immediate: true },
    );

    const $toolkit = {
      ...toolkitInstance,
      get sharedContext() {
        return sharedContext;
      },
    };

    app.provide('toolkit', $toolkit);
    app.config.globalProperties.$toolkit = $toolkit;
  },
};

export const useToolkit = () => {
  return inject('toolkit');
};
