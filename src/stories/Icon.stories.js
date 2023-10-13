import Icon from '~widgets/icon/widget.vue';

import * as icons from '@cloudblueconnect/material-svg';

export default {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    iconName: {
      options: Object.keys(icons),
      control: {
        type: 'select',
      },
    }
  }
};

export const Component = {
  render: (args) => ({
    components: { Icon },
    setup() {
      return { args };
    },
    template: '<icon v-bind="args"></icon>',
  }),
  args: {
    iconName: 'googleSnowboardingBaseline',
    size: '32',
    color: '#757575',
  }
};
