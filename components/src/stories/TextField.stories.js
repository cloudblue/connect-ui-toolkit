import isEmail from 'validator/es/lib/isEmail';

import cTextField from '~widgets/textfield/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-textfield', cTextField);

export const Basic = {
  name: 'Basic options',
  render: (args) => ({
    setup() {
      return { args };
    },
    template: '<ui-textfield v-bind="args" style="width:400px;"></ui-textfield>',
  }),

  args: {
    label: 'Simple textfield',
    hint: 'This is a hint for the text field input',
    value: '',
    placeholder: 'Placeholder text',
    suffix: '',
  },
};

export const Validation = {
  name: 'Input validation',
  render: Basic.render,

  args: {
    label: 'Text field with validation',
    hint: 'This is a text field with validation. The value should be an email',
    value: '',
    placeholder: 'john.doe@example.com',
    required: true,
    rules: [
      (value) => !!value || 'This field is required',
      (value) => isEmail(value) || 'The value is not a valid email address',
    ],
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
    required: 'boolean',
  },
};
