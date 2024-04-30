import Textarea from '~widgets/textarea/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-textarea', Textarea);

export const Basic = {
  name: 'Basic options',
  render: (args) => ({
    setup() {
      return { args };
    },
    template: '<ui-textarea v-bind="args"></ui-textarea>',
  }),

  args: {
    value: '',
    placeholder: 'Placeholder text',
    label: 'Label',
  },
};

export default {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: 'text',
    readonly: 'boolean',
    placeholder: 'text',
    required: 'boolean',
    autoGrow: 'boolean',
    noBorder: 'boolean',
    rows: 'number',
    label: 'string',
  },
};
