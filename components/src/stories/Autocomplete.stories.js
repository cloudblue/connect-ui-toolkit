import Autocomplete from '~widgets/autocomplete/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-autocomplete', Autocomplete);

export const Basic = {
  name: 'Basic options',
  render: (args) => ({
    setup() {
      return { args };
    },
    template: '<ui-autocomplete v-bind="args" style="width:400px;"></ui-autocomplete>',
  }),

  args: {
    label: 'Label text',
    options: ['Andorra', 'Peru', 'Poland', 'Spain', 'USA'],
  },
};

export const Object = {
  name: 'Array of objects in options',
  render: Basic.render,
  args: {
    ...Basic.args,
    propValue: 'value',
    propText: 'label',
    options: [
      { value: 'AR', label: 'Argentina' },
      { value: 'AD', label: 'Andorra' },
      { value: 'PL', label: 'Poland' },
    ],
  },
};

export const Validation = {
  name: 'Input validation',
  render: Basic.render,

  args: {
    ...Basic.args,
    label: 'Select input with validation',
    hint: 'Select the second option if you want the validation to be successful',
    propValue: 'id',
    propText: 'name',
    required: true,
    options: [
      { id: 'OBJ-123', name: 'The first object' },
      { id: 'OBJ-456', name: 'The second object' },
      { id: 'OBJ-789', name: 'The third object' },
    ],
    rules: [(value) => value === 'OBJ-456' || 'You picked the wrong option :( '],
  },
};

export default {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: 'text',
    modelValue: 'text',
    hint: 'text',
    propValue: 'text',
    propText: 'text',
    required: 'boolean',
    options: { control: 'array' },
  },
};
