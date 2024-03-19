import { ref } from 'vue';

import Select from '~widgets/select/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-select', Select);

export const Basic = {
  name: 'Basic options',
  render: (args) => ({
    setup() {
      return { args };
    },
    template: '<ui-select v-bind="args" style="width:200px;"></ui-select>',
  }),

  args: {
    label: 'Label text',
    modelValue: '',
    hint: 'Some hint text',
    options: ['foo', 'bar', 'baz'],
  },
};

export const Object = {
  name: 'Array of objects in options',
  render: Basic.render,
  args: {
    ...Basic.args,
    propValue: 'id',
    propText: 'name',
    options: [
      { id: 'OBJ-123', name: 'The first object' },
      { id: 'OBJ-456', name: 'The second object' },
      { id: 'OBJ-789', name: 'The third object' },
    ],
  },
};

export const Events = {
  name: 'Using v-model',
  render: (args) => ({
    setup() {
      const selectedItem = ref('');
      const setSelectedItem = (event) => {
        selectedItem.value = event.detail[0];
      };

      return { args, selectedItem, setSelectedItem };
    },
    template: `
      <div>
        <p>The current selected value is: {{ selectedItem }}</p>
        <ui-select
          v-bind="args"
          :modelValue="selectedItem"
          @update:modelValue="setSelectedItem"
          style="width:200px;"
        />
      </div>
    `,
  }),
  args: Basic.args,
};

export default {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: 'text',
    modelValue: 'text',
    hint: 'text',
    propValue: 'text',
    propText: 'text',
    options: { control: 'array' },
  },
};
