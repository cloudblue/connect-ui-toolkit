import Radio from '~widgets/radio/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-radio', Radio);

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `<ui-radio v-bind="args"></ui-radio>`,
  }),

  args: {
    label: 'Option',
    selectedValue: 'foo',
    radioValue: 'foo',
  },
};

export default {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: 'text',
    radioValue: 'text',
    selectedValue: 'text',
  },
};
