import Textarea from '~widgets/textarea/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-textarea', Textarea);

export const Basic = {
  name: 'Basic options',
  render: (args) => ({
    setup() {
      return { args };
    },
    template: '<ui-textarea v-bind="args" style="width:400px;"></ui-textarea>',
  }),

  args: {
    label: 'Simple textarea',
    hint: 'This is a hint for the text area input',
    value: '',
    placeholder: 'Placeholder text',
  },
};

export const Validation = {
  name: 'Input validation',
  render: Basic.render,

  args: {
    label: 'Text area with validation',
    hint: 'This is a text area with validation. The text should be < 30 characters.',
    value: '',
    placeholder: 'Lorem ipsum dolor sit amet',
    required: true,
    rules: [
      (value) => !!value || 'This field is required',
      (value) => value.length < 30 || 'The value must be less than 30 characters',
    ],
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
    hint: 'text',
    placeholder: 'text',
    required: 'boolean',
    autoGrow: 'boolean',
    noBorder: 'boolean',
    monospace: 'boolean',
    rows: 'number',
    label: 'string',
  },
};
