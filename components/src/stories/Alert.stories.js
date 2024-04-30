import Alert from '~widgets/alert/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-alert', Alert);

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `<ui-alert v-bind="args"></ui-alert>`,
  }),

  args: {
    message: 'This is an alert item',
  },
};

export default {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    message: 'text',
    icon: 'text',
    type: 'text',
  },
};
