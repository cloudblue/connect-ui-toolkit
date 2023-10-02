import Icon from '../widgets/icon/widget.vue';

import * as icons from '@cloudblueconnect/material-svg/baseline';

// const icons2 = { googleAssignmentTurnedInBaseline: 'googleAssignmentTurnedInBaseline', googleWifiLockBaseline: 'googleWifiLockBaseline', googleAspectRatioBaseline: 'googleAspectRatioBaseline'};

export default {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    iconName: {
      options: Object.keys(icons),
      // mapping: icons2,
      control: { 
        type: 'select',
        // labels: {
        //   googleAssignmentTurnedInBaseline: 'googleAssignmentTurnedInBaseline',
        //   googleWifiLockBaseline: 'googleWifiLockBaseline',
        // }
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
    template: '<icon v-bind="args"><icon>',
  }),
  args: {
    iconName: 'googleWifiLockBaseline',
    size: '48px',
    color: '#757575',
  }
};
