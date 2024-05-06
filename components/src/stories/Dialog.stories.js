import Dialog from '~widgets/dialog/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-dialog', Dialog);

export default {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
};

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `
    <ui-dialog v-bind="args" style="position: relative;">
      <div slot>
        {{ args.content }}
      </div>
    </ui-dialog>`,
  }),

  args: {
    value: true,
    title: 'Dialog Title',
    actions: ['cancel', 'submit'],
    height: '500px',
    width: '800px',
    isValid: true,
    submitLabel: 'Submit',
    content: 'This is the dialog content :-)',
  },
  decorators: [() => ({ template: '<div style="height: 600px;"><story/></div>' })],
};
