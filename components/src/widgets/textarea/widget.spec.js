import { shallowMount } from '@vue/test-utils';

import TextArea from './widget.vue';

describe('TextArea component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TextArea, {
      props: {
        modelValue: 'textarea text',
        noBorder: true,
        autoGrow: true,
        rows: 4,
        placeholder: 'placeholder',
      },
      global: {
        renderStubDefaultSlot: true,
      },
    });
  });

  describe('render', () => {
    test('renders the base component', () => {
      expect(wrapper.get('.textarea-field').attributes()).toEqual(
        expect.objectContaining({
          class: 'textarea-field textarea-field_optional',
        }),
      );

      expect(wrapper.get('textarea').attributes()).toEqual(
        expect.objectContaining({
          class:
            'textarea-field__input textarea-field__input_no-resize textarea-field__input_no-border',
          name: 'textarea',
          placeholder: 'placeholder',
          rows: '4',
          style: 'height: 96px;',
        }),
      );
    });
  });

  describe('validation', () => {
    let rule1;
    let rule2;

    beforeEach(async () => {
      rule1 = vi.fn().mockReturnValue(true);
      rule2 = vi.fn().mockReturnValue('This field is invalid');

      wrapper = shallowMount(TextArea, {
        props: {
          hint: 'Hint text',
          rules: [rule1, rule2],
        },
      });

      await wrapper.get('.textarea-field__input').setValue('foo');
    });

    it('validates the input value against the rules prop', () => {
      expect(rule1).toHaveBeenCalledWith('foo');
      expect(rule2).toHaveBeenCalledWith('foo');
    });

    it('renders the error messages if validation fails', () => {
      expect(wrapper.get('.textarea-field__error-message').text()).toEqual(
        'This field is invalid.',
      );
    });

    it('adds the "textarea-field_invalid" class to the element', () => {
      expect(wrapper.classes()).toContain('textarea-field_invalid');
    });
  });

  describe('#calculateInputHeight', () => {
    test('calculates and sets the right height when is autogrow', () => {
      wrapper.vm.calculateInputHeight();

      expect(wrapper.get('textarea').wrapperElement.style.height).toEqual('96px');
    });
  });

  describe('#onMounted', () => {
    test('calls calculateInputHeight and sets the right height', () => {
      expect(wrapper.get('textarea').wrapperElement.style.height).toEqual('96px');
    });
  });

  describe('watch', () => {
    test('calls calculateInputHeight and sets the right height', () => {
      expect(wrapper.get('textarea').wrapperElement.style.height).toEqual('96px');
    });
  });
});
