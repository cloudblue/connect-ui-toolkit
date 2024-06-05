import Icon from '~widgets/icon/widget.vue';
import registerWidget from '~core/registerWidget';

import * as iconsAnimated from '@cloudblueconnect/material-svg/animated';
import * as iconsBaseline from '@cloudblueconnect/material-svg/baseline';

registerWidget('ui-icon', Icon);

export default {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    iconName: {
      options: Object.keys(iconsBaseline),
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

export const Animated = {
  name: 'All animated',
  render: () => ({
    setup() {
      return {};
    },
    template:
      '<div className="sb-all-icons">' +
      Object.keys(iconsAnimated)
        .map(
          (icon) =>
            `<div className="sb-icon-wrapper"><ui-icon className="sb-icon" iconName="${icon}" size="24"/> <span>${icon}</span></div>`,
        )
        .join('') +
      '</div>',
  }),
  args: {},
  argTypes: {
    iconName: { control: false },
    size: { control: false },
    color: { control: false },
  },
};

export const Baseline = {
  name: 'All baseline',
  render: () => ({
    setup() {
      return {};
    },
    template:
      '<div className="sb-all-icons">' +
      Object.keys(iconsBaseline)
        .map(
          (icon) =>
            `<div className="sb-icon-wrapper"><ui-icon className="sb-icon" iconName="${icon}" size="24"/> <span>${icon}</span></div>`,
        )
        .join('') +
      '</div>',
  }),
  args: {},
  argTypes: {
    iconName: { control: false },
    size: { control: false },
    color: { control: false },
  },
};
