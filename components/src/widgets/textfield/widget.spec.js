import { mount } from '@vue/test-utils';
import Textfield from './widget.vue';

describe('Textfield widget', () => {
  let wrapper;

  describe('render', () => {
    it('renders the base component without any prop', () => {
      wrapper = mount(Textfield);

      expect(wrapper.get('.text-field').exists()).toBeTruthy();
      expect(wrapper.get('.text-field label').text()).toEqual('');
      expect(wrapper.get('.text-field__input').exists()).toBeTruthy();
      expect(wrapper.get('.text-field__input').element.value).toEqual('');
      expect(wrapper.get('.text-field__input').attributes('placeholder')).toEqual('');
      expect(wrapper.find('.text-field__suffix').exists()).toBeFalsy();
      expect(wrapper.find('.text-field_focused').exists()).toBeFalsy();
      expect(wrapper.find('.text-field__input_right').exists()).toBeFalsy();
    });

    it('renders the base component with the props set', () => {
      wrapper = mount(Textfield, {
        props: {
          value: 'Foo',
          label: 'My text input',
          placeholder: 'Insert text here',
          suffix: 'hh:mm:ssss.csv',
        },
      });

      expect(wrapper.get('.text-field').exists()).toBeTruthy();
      expect(wrapper.get('.text-field label').text()).toEqual('My text input');
      expect(wrapper.get('.text-field__input').exists()).toBeTruthy();
      expect(wrapper.get('.text-field__input').element.value).toEqual('Foo');
      expect(wrapper.get('.text-field__input').attributes('placeholder')).toEqual(
        'Insert text here',
      );
      expect(wrapper.get('.text-field__suffix').text()).toEqual('hh:mm:ssss.csv');
      expect(wrapper.get('.text-field__input_right').exists()).toBeTruthy();
      expect(wrapper.find('.text-field_focused').exists()).toBeFalsy();
    });

    it('sets the "text-field_focused" class when focused', async () => {
      wrapper = mount(Textfield);

      await wrapper.find('.text-field').trigger('focusin');

      expect(wrapper.get('.text-field_focused').exists()).toBeTruthy();
    });
  });

  describe('events', () => {
    it('emits the "input" event when the input element value changes', async () => {
      wrapper = mount(Textfield);

      await wrapper.find('.text-field__input').setValue('lorem ipsum');

      expect(wrapper.emitted().input[0]).toEqual(['lorem ipsum']);
    });
  });
});
