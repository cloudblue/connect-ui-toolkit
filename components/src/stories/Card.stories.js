import cCard from '~widgets/card/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-card', cCard);

export default {
  title: 'Components/Card',
  component: cCard,
  parameters: {
    layout: 'centered',
  }
};

export const Component = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `
    <ui-card v-bind="args" style="width: 400px">
      <div slot="default">
        {{ args.content }}
      </div>
      <div slot="actions">
        <button>Action!</button>
      </div>
    </ui-card>`,
  }),

  args: {
    title: 'Card Title',
    subtitle: 'Card Subtitle',
    content: 'Card Content',
  }
};
