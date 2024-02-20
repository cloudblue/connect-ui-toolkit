import cNav from '~widgets/navigation/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-nav', cNav);

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: '<ui-nav v-bind="args" @click-tab="setTab" @go-back="goBack"><div slot="actions"><button>Action Button (slot example)</button></div></ui-nav>',
    methods: {
      setTab({ detail }) {
        this.args.currentTab = detail;
      },
      goBack() {
        alert('The back button was clicked!');
      },
    },
  }),

  args: {
    title: 'Title',
    assistiveTitle: 'Assistive title',
    currentTab: 'first',
    tabs: [
      { value: 'first', label: 'First tab' },
      { value: 'second', label: 'Second tab' },
    ],
    showBackButton: false,
  },
};

export default {
  title: 'Components/Navigation',
  component: cNav,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: 'text',
    assistiveTitle: 'text',
    tabs: {
      control: 'object',
    },
    currentTab: {
      control: 'select',
      options: Component.args.tabs.map(v => v.value),
    },
    showBackButton: 'boolean',
  },
};
