import Button from '~widgets/button/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-button', Button);

export const Base = {
  name: 'Base component',
  render: (args) => ({
    setup() {
      const showAlert = () => alert('The button was clicked');
      return { args, showAlert };
    },
    template: '<ui-button v-bind="args" @clicked="showAlert" />',
  }),
  args: {
    mode: 'solid',
    size: 'large',
    label: 'Accept',
    icon: 'googleCheckBaseline',
    iconRight: '',
    color: '#2C98F0',
    progress: false,
    lowerCase: false,
    onlyIcon: false,
    disabled: false,
  },
};

export const Slotted = {
  name: 'Using the default slot',
  render: (args) => ({
    setup() {
      const showAlert = () => alert('The button was clicked');
      return { args, showAlert };
    },
    template:
      '<ui-button v-bind="args" @clicked="showAlert"><pre style="background-color:darkblue;color:lightcyan;font-style:italic;">Custom slot content</pre></ui-button>',
  }),
  args: {
    ...Base.args,
    label: '',
  },
};

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/iWvG1cSD2xzbGS2KAB1DgV/Connect-UI-Guides-%26-Specs?type=design&node-id=1-4009&mode=design&t=5CPLKuHbPQnKMEJh-0',
    },
  },
  argTypes: {
    mode: { control: 'radio', options: ['solid', 'flat', 'outlined'] },
    size: { control: 'radio', options: ['small', 'large'] },
    label: 'text',
    icon: 'text',
    iconRight: 'text',
    color: 'text',
    progress: 'boolean',
    lowerCase: 'boolean',
    onlyIcon: 'boolean',
    disabled: 'boolean',
  },
};
