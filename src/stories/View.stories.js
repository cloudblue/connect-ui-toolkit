import cView from '~widgets/view/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-view', cView);

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `
      <ui-view v-bind="args">
        <div slot="loader">Loader slot: Loading...</div>
        <div slot="actions"><button>Action Button (slot example)</button></div>
        <div slot="first"><p>First tab content</p></div>
        <div slot="second"><p>Second tab content</p></div>
      </ui-view>`,
  }),

  args: {
    loading: false,
    noPadded: false,
    title: 'Title',
    assistiveTitle: 'Assistive title',
    currentTab: '',
    tabs: [
      { value: 'first', label: 'First tab' },
      { value: 'second', label: 'Second tab' },
    ],
  },
};

export default {
  title: 'Components/View',
  component: cView,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    loading: 'boolean',
    noPadded: 'boolean',
    title: 'text',
    assistiveTitle: 'text',
    tabs: {
      control: 'object',
    },
    currentTab: 'text',
  },
};
