import { mount } from '@vue/test-utils';
import Select from './widget.vue';

describe('Select', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: ['foo', 'bar', 'baz'],
        label: 'My select',
        hint: 'Some random hint',
      },
    });
  });

  describe('render', () => {
    it('renders the base component', () => {
      expect(wrapper.get('.select-input__label').text()).toEqual('My select');
      expect(wrapper.get('.select-input__hint').text()).toEqual('Some random hint');
      expect(wrapper.get('.select-input__no-selection').text()).toEqual('—');
    });

    it('renders a simple array of text elements', () => {
      const menuOptions = wrapper.findAll('.select-input__option');

      expect(menuOptions.length).toEqual(3);
      expect(menuOptions[0].text()).toEqual('foo');
      expect(menuOptions[1].text()).toEqual('bar');
      expect(menuOptions[2].text()).toEqual('baz');
    });

    it('renders a complex array of objects', async () => {
      await wrapper.setProps({
        options: [
          { id: '123', external_id: 'ext-123', name: 'Foo' },
          { id: '456', external_id: 'ext-456', name: 'Bar' },
          { id: '789', external_id: 'ext-789', name: 'Baz' },
        ],
        propValue: 'external_id',
        propText: 'name',
      });

      const menuOptions = wrapper.findAll('.select-input__option');

      expect(menuOptions.length).toEqual(3);
      expect(menuOptions[0].text()).toEqual('Foo');
      expect(menuOptions[1].text()).toEqual('Bar');
      expect(menuOptions[2].text()).toEqual('Baz');
    });
  });

  describe('events', () => {
    describe('when an item is selected', () => {
      beforeEach(async () => {
        await wrapper.findAll('.select-input__option')[1].trigger('click');
      });

      it('renders the selected item', () => {
        expect(wrapper.get('.select-input__option_selected').text()).toEqual('bar');
        expect(wrapper.get('.select-input__selected').text()).toEqual('bar');
      });

      it('emits the update:modelValue event with the selected value', () => {
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['bar']);
      });

      it('emits the valueChange event with the selected value', () => {
        expect(wrapper.emitted('valueChange')[0]).toEqual(['bar']);
      });
    });
  });
});
