import { mount } from '@vue/test-utils';
import Textfield from './widget.vue';

describe('Textfield widget', () => {
  let wrapper;

  describe('render', () => {
    it('renders the base component without any prop', () => {
      wrapper = mount(Textfield);

      expect(wrapper.get('.text-field').exists()).toBeTruthy();
      expect(wrapper.get('.text-field__input').exists()).toBeTruthy();
      expect(wrapper.get('.text-field__input').element.value).toEqual('');
      expect(wrapper.get('.text-field__input').attributes('placeholder')).toEqual('');
      expect(wrapper.find('.text-field label').exists()).toBeFalsy();
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
      expect(wrapper.get('.text-field label').text()).toEqual('My text input (Optional)');
      expect(wrapper.get('.text-field__input').exists()).toBeTruthy();
      expect(wrapper.get('.text-field__input').element.value).toEqual('Foo');
      expect(wrapper.get('.text-field__input').attributes('placeholder')).toEqual(
        'Insert text here',
      );
      expect(wrapper.get('.text-field__suffix').text()).toEqual('hh:mm:ssss.csv');
      expect(wrapper.get('.text-field__input_right').exists()).toBeTruthy();
      expect(wrapper.find('.text-field_focused').exists()).toBeFalsy();
    });

    it('renders the hint, if used', () => {
      wrapper = mount(Textfield, {
        props: {
          hint: 'Please fill this input',
        },
      });

      expect(wrapper.get('.text-field__hint').text()).toEqual('Please fill this input');
    });

    it('does not render the "(Optional)" text in label if required is true', () => {
      wrapper = mount(Textfield, {
        props: {
          label: 'My input',
          required: true,
        },
      });

      expect(wrapper.get('.text-field label').text()).toEqual('My input');
    });
  });

  describe('validation', () => {
    let rule1;
    let rule2;

    beforeEach(async () => {
      rule1 = vi.fn().mockReturnValue(true);
      rule2 = vi.fn().mockReturnValue('This field is invalid');

      wrapper = mount(Textfield, {
        props: {
          hint: 'Hint text',
          rules: [rule1, rule2],
        },
      });

      await wrapper.get('.text-field__input').setValue('foo');
    });

    it('validates the input value against the rules prop', () => {
      expect(rule1).toHaveBeenCalledWith('foo');
      expect(rule2).toHaveBeenCalledWith('foo');
    });

    it('renders the error messages if validation fails', () => {
      expect(wrapper.get('.text-field__error-message').text()).toEqual('This field is invalid.');
    });

    it('does not render the hint if there is an error', () => {
      expect(wrapper.get('.text-field__hint').text()).not.toEqual('Hint text');
    });

    it('adds the "text-field_invalid" class to the element', () => {
      expect(wrapper.classes()).toContain('text-field_invalid');
    });
  });

  describe('events', () => {
    it('emits the "input" event when the input element value changes', async () => {
      wrapper = mount(Textfield);

      await wrapper.find('.text-field__input').setValue('lorem ipsum');

      expect(wrapper.emitted().input[0]).toEqual(['lorem ipsum']);
    });

    it('sets the "text-field_focused" class when clicked', async () => {
      wrapper = mount(Textfield);

      await wrapper.get('.text-field__wrapper').trigger('click');

      expect(wrapper.classes()).toContain('text-field_focused');
    });

    it('removes the "text-field_focused" class when the focus is removed', async () => {
      wrapper = mount(Textfield);
      await wrapper.get('.text-field__wrapper').trigger('click');

      await wrapper.get('.text-field__wrapper').trigger('focusout');

      expect(wrapper.classes()).not.toContain('text-field_focused');
    });
  });
});
