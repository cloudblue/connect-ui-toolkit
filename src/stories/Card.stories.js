import cCard from '../widgets/card/widget.vue';

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

export const Default = Template.bind({});
Default.args = {
  title: 'Card Title',
  subtitle: 'Card Subtitle',
  content: 'Card Content',
};