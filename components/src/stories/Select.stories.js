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

export const Slots = {
  name: 'Custom element render',
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
        <ui-select
          v-bind="args"
          :modelValue="selectedItem"
          @update:modelValue="setSelectedItem"
          style="width:500px;"
        >
          <span slot="selected">
            <template v-if="selectedItem">The current selected value is: {{ selectedItem }}</template>
            <template v-else>There is no item selected</template>
          </span>
        </ui-select>
      </div>
    `,
  }),
  args: {
    ...Basic.args,
    label: 'This implementation uses the "selected" slot and the "optionTextFn"',
    options: [
      { id: 'OBJ-123', name: 'The first object' },
      { id: 'OBJ-456', name: 'The second object' },
      { id: 'OBJ-789', name: 'The third object' },
    ],
    optionTextFn: (item) => `${item.name} (${item.id})`,
  },
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
    required: 'boolean',
    options: { control: 'array' },
  },
};
