import RadioInput from './widget.vue';
import { shallowMount } from '@vue/test-utils';

describe('RadioInput component', () => {
  describe('render', () => {
    describe('when is checked', () => {
      test('renders the base component', () => {
        const wrapper = shallowMount(RadioInput, {
          props: {
            radioValue: 'foo',
            label: 'My radio input',
            selectedValue: 'foo',
          },
        });

        expect(wrapper.get('.radio-input ui-icon').attributes()).toEqual(
          expect.objectContaining({
            iconname: 'googleRadioButtonCheckedBaseline',
            color: '#2C98F0',
          }),
        );
        expect(wrapper.get('.radio-input__label').classes()).not.toContain(
          'radio-input__label_empty',
        );
        expect(wrapper.get('.radio-input__label-text').text()).toEqual('My radio input');
        expect(wrapper.vm.isSelected).toEqual(true);
        expect(wrapper.vm.icon).toEqual('googleRadioButtonCheckedBaseline');
        expect(wrapper.vm.iconColor).toEqual('#2C98F0');
      });
    });

    describe('when is unchecked', () => {
      test('renders the base component', () => {
        const wrapper = shallowMount(RadioInput, {
          props: {
            radioValue: 'foo',
            label: 'My radio input',
            selectedValue: 'bar',
          },
        });

        expect(wrapper.get('.radio-input ui-icon').attributes()).toEqual(
          expect.objectContaining({
            iconname: 'googleRadioButtonUncheckedBaseline',
            color: '',
          }),
        );
        expect(wrapper.get('.radio-input__label').classes()).not.toContain(
          'radio-input__label_empty',
        );
        expect(wrapper.get('.radio-input__label-text').text()).toEqual('My radio input');
        expect(wrapper.vm.isSelected).toEqual(false);
        expect(wrapper.vm.icon).toEqual('googleRadioButtonUncheckedBaseline');
        expect(wrapper.vm.iconColor).toEqual('');
      });
    });

    describe('when there is no label', () => {
      test('adds the "radio-input__label_empty" class to the label element if there is no label', () => {
        const wrapper = shallowMount(RadioInput, {
          props: {
            radioValue: 'foo',
            selectedValue: 'foo',
            label: '',
          },
        });

        expect(wrapper.get('.radio-input__label').classes()).toContain('radio-input__label_empty');
      });
    });
  });

  describe('events', () => {
    describe('#select', () => {
      test('it triggers the selected event with the radio value', () => {
        const wrapper = shallowMount(RadioInput, {
          props: {
            radioValue: 'bar',
            selectedValue: 'foo',
            label: 'label',
          },
        });

        wrapper.vm.select();

        expect(wrapper.emitted('selected')).toBeTruthy();
        expect(wrapper.emitted()).toEqual({ selected: [['bar']] });
      });
    });
  });
});
