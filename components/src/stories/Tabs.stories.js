import cTabs from '~widgets/tabs/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-tabs', cTabs);

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template:
      '<ui-tabs v-bind="args" @click-tab="setTab"><div slot="first">Content for First tab</div><div slot="second">Content for Second tab</div></ui-tabs>',
    methods: {
      setTab({ detail }) {
        this.args.currentTab = detail;
      },
    },
  }),

  args: {
    currentTab: 'first',
    tabs: [
      { value: 'first', label: 'First tab' },
      { value: 'second', label: 'Second tab' },
    ],
    clean: false,
  },
};

export default {
  title: 'Components/Tabs',
  component: cTabs,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    tabs: {
      control: 'object',
    },
    currentTab: {
      control: 'select',
      options: Component.args.tabs.map((v) => v.value),
    },
  },
};
