import cTextField from '~widgets/textfield/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-textfield', cTextField);

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: '<ui-textfield v-bind="args"></ui-textfield>',
  }),

  args: {
    label: 'Label text',
    value: '',
    placeholder: 'Placeholder text',
    suffix: '',
  },
};

export default {
  title: 'Components/TextField',
  component: cTextField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: 'text',
    value: 'text',
    placeholder: 'text',
    suffix: 'text',
  },
};
