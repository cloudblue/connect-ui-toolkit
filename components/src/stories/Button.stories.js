import Button from '~widgets/button/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-button', Button);


export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `<ui-button disabled v-bind="args"></ui-button>`,
  }),

  args: {
    text: 'Text',
  },
};

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: 'text',
  },
};
