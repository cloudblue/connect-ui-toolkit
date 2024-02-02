import Status from '~widgets/status/widget.vue';
import registerWidget from '~core/registerWidget';

import * as icons from '@cloudblueconnect/material-svg';

registerWidget('ui-status', Status);

export default {
  title: 'Components/Status',
  component: Status,
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
    components: { Status },
    setup() {
      return { args };
    },
    template: '<ui-status style="font-size: 20px" v-bind="args"></ui-status>',
  }),

  args: {
    text: 'Status text',
    iconName: 'googleUpdateBaseline',
    iconColor: 'green',
    iconSize: '20',
  }
};