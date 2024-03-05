import Icon from '~widgets/icon/widget.vue';
import registerWidget from '~core/registerWidget';

import * as icons from '@cloudblueconnect/material-svg';

registerWidget('ui-icon', Icon);

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
    },
  },
};

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: '<ui-icon v-bind="args"></ui-icon>',
  }),
  args: {
    iconName: 'googleSnowboardingBaseline',
    size: '32',
    color: '#757575',
  },
};
