import { mount } from '@vue/test-utils';
import Autocomplete from './widget.vue';

describe('Autocomplete', () => {
  let wrapper;

  const options = [
    { id: '1', name: 'Andorra' },
    { id: '2', name: 'Poland' },
    { id: '3', name: 'Spain' },
  ];

  beforeEach(() => {
    wrapper = mount(Autocomplete, {
      props: {
        label: 'Countries',
        options,
        propText: 'name',
        propValue: 'id',
        required: true,
        hint: 'Select a country',
      },
    });
  });

  describe('render', () => {
    it('renders the base component', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.autocomplete').exists()).toBe(true);
      expect(wrapper.find('ui-select').exists()).toBe(true);
      expect(wrapper.find('ui-textfield').exists()).toBe(true);
    });

    it('filters options based on user input', async () => {
      const textField = wrapper.find('ui-textfield');

      await textField.trigger('input', { detail: ['an'] });

      const filteredOptions = wrapper.vm.filteredOptions;

      expect(filteredOptions.length).toBe(2);
      expect(filteredOptions).toEqual([
        { id: '1', name: 'Andorra' },
        { id: '2', name: 'Poland' },
      ]);
    });

    it('updates selected value correctly', async () => {
      const select = wrapper.find('ui-select');

      await select.trigger('value-change', { detail: ['some option'] });

      const selected = wrapper.vm.selected;

      expect(selected).toBe('some option');
    });

    it('clears the user input after selection', async () => {
      const select = wrapper.find('ui-select');
      const textfield = wrapper.find('ui-textfield');

      await textfield.trigger('input', { detail: ['spa'] });

      let userInput = wrapper.vm.userInput;

      expect(userInput).toBe('spa');

      await select.trigger('value-change', { detail: ['Spain'] });

      userInput = wrapper.vm.userInput;

      expect(userInput).toBe('');
    });
  });
});
