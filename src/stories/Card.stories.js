import cCard from '../widgets/card/component.vue';

export default {
  title: 'Components/Card',
  component: cCard,
  parameters: {
    layout: 'centered',
  }
};

const Template = (args) => ({
  components: { cCard },
  setup() {
    return { ...args };
  },
  template: '<c-card :title="title" :subtitle="subtitle">{{ content }}</c-card>',
});

export const Component = Template.bind({});

Component.args = {
  title: 'Card Title',
  subtitle: 'Card Subtitle',
  content: 'Card Content',
};