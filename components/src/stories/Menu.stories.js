import Menu from '~widgets/menu/widget.vue';
import Button from '~widgets/button/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-menu', Menu);
registerWidget('ui-button', Button);

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `
      <ui-menu v-bind="args">
        <ui-button 
          slot="trigger"
          iconRight="googleArrowDropDownBaseline"
          label="open menu" 
          mode="flat"
          size="small"
        />
        <div style="padding:8px 16px; border:1px solid black;" slot="content">
          <p>Lorem ipsum dolor sit amet</p>
        </div>
      </ui-menu>
    `,
  }),

  args: {
    align: 'left',
    closeOnClickInside: false,
    fullWidth: false,
  },
};

export default {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },

  argTypes: {
    closeOnClickInside: 'boolean',
    fullWidth: 'boolean',
    align: {
      options: ['right', 'left'],
      control: {
        type: 'select',
      },
    },
  },
};
