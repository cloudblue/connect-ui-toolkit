import Menu from '~widgets/menu/widget.vue';
import Button from '~widgets/button/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-menu', Menu);
registerWidget('ui-button', Button);

export const Component = {
  render: (args) => ({
    setup() {
      return {args};
    },
    template: `<ui-menu>
    <ui-button 
      slot="trigger" 
      text="open menu" 
    />
    <div style="padding:8px 16px; width:300px; border:1px solid black;" slot="content">
      <p>item</p>
    </div>
  </ui-menu>`
  }),
};

export default {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
};