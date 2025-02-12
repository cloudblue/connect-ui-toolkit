import { mount } from '@vue/test-utils';
import Select from './widget.vue';
import { nextTick } from 'vue';

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
      expect(wrapper.get('.select-input__label').text()).toEqual('My select (Optional)');
      expect(wrapper.get('.select-input__hint').text()).toEqual('Some random hint');
      expect(wrapper.get('.select-input__no-selection').text()).toEqual('');
    });

    it('renders a simple array of text elements', () => {
      const menuOptions = wrapper.findAll('.select-input__option');

      expect(menuOptions.length).toEqual(3);
      expect(menuOptions[0].text()).toEqual('foo');
      expect(menuOptions[1].text()).toEqual('bar');
      expect(menuOptions[2].text()).toEqual('baz');
    });

    it('does not render the "(Optional)" text in the label if required is true', async () => {
      await wrapper.setProps({
        required: true,
      });

      expect(wrapper.get('.select-input__label').text()).toEqual('My select');
    });

    it('adds the disabled class if disabled is true', async () => {
      await wrapper.setProps({
        disabled: true,
      });

      expect(wrapper.get('.select-input__selected').classes()).toContain(
        'select-input__selected_disabled',
      );
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

    it('can render option text based on the optionTextFn prop', async () => {
      await wrapper.setProps({
        options: [
          { id: '123', external_id: 'ext-123', name: 'Foo' },
          { id: '456', external_id: 'ext-456', name: 'Bar' },
          { id: '789', external_id: 'ext-789', name: 'Baz' },
        ],
        optionTextFn: (option) => `${option.name} (${option.id})`,
      });

      const menuOptions = wrapper.findAll('.select-input__option');

      expect(menuOptions.length).toEqual(3);
      expect(menuOptions[0].text()).toEqual('Foo (123)');
      expect(menuOptions[1].text()).toEqual('Bar (456)');
      expect(menuOptions[2].text()).toEqual('Baz (789)');
    });
  });

  describe('validation', () => {
    let rule1;
    let rule2;

    beforeEach(async () => {
      rule1 = vi.fn().mockReturnValue(true);
      rule2 = vi.fn().mockReturnValue('This field is invalid');

      wrapper = mount(Select, {
        props: {
          modelValue: '',
          options: ['foo', 'bar', 'baz'],
          hint: 'Hint text',
          rules: [rule1, rule2],
        },
      });

      await wrapper.findAll('.select-input__option')[1].trigger('click');
    });

    it('validates the input value against the rules prop', () => {
      expect(rule1).toHaveBeenCalledWith('bar');
      expect(rule2).toHaveBeenCalledWith('bar');
    });

    it('renders the error messages if validation fails', () => {
      expect(wrapper.get('.select-input__error-message').text()).toEqual('This field is invalid.');
    });

    it('does not render the hint if there is an error', () => {
      expect(wrapper.get('.select-input__hint').text()).not.toEqual('Hint text');
    });

    it('adds the "select-input_invalid" class to the element', () => {
      expect(wrapper.classes()).toContain('select-input_invalid');
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

    describe('when the menu is opened', () => {
      it('adds the "select-input_focused" class', async () => {
        await wrapper.get('ui-menu').trigger('opened');

        expect(wrapper.classes()).toContain('select-input_focused');
      });
    });

    describe('when the menu is closed', () => {
      it('removes the "select-input_focused" class', async () => {
        // open the menu first
        await wrapper.get('ui-menu').trigger('opened');

        await wrapper.get('ui-menu').trigger('closed');

        expect(wrapper.classes()).not.toContain('select-input_focused');
      });
    });
  });

  describe('watch', () => {
    beforeEach(() => {
      wrapper = mount(Select, {
        props: {
          modelValue: '1',
          options: [
            { id: '1', value: 'Option 1' },
            { id: '2', value: 'Option 2' },
          ],
          propValue: 'id',
        },
      });
    });

    it('should update selectedOption when model changes', async () => {
      // Initial check
      expect(wrapper.vm.selectedOption).toEqual({ id: '1', value: 'Option 1' });

      await wrapper.setProps({ modelValue: '2' });
      await nextTick();

      expect(wrapper.vm.selectedOption).toEqual({ id: '2', value: 'Option 2' });
    });
  });
});
