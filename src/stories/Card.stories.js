import cCard from '../widgets/card/widget.vue';

export default {
  title: 'Components/Card',
  component: cCard,
  parameters: {
    layout: 'centered',
  }
};

export const Component = {
  render: (args) => ({
    components: { cCard },
    setup() {
      return { args };
    },
    template: '<c-card v-bind="args">{{ args.content }}</c-card>',
  }),

  args: {
    title: 'Card Title',
    subtitle: 'Card Subtitle',
    content: 'Card Content',
  }
};
