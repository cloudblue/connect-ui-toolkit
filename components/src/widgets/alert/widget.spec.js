import { shallowMount } from '@vue/test-utils';

import Alert from './widget.vue';

describe('Alert component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Alert, {
      props: {
        modelValue: true,
        message: 'this is a message',
        type: 'success',
      },
      global: {
        renderStubDefaultSlot: true,
      },
    });
  });

  describe('render', () => {
    test('renders the base component', () => {
      expect(wrapper.get('.alert-holder').attributes()).toEqual(
        expect.objectContaining({
          class: 'alert-holder alert_success',
          modelvalue: 'true',
        }),
      );

      const text = wrapper.find('.alert__text');

      expect(text.text()).toEqual('this is a message');

      const icon = wrapper.find('ui-icon');

      expect(icon.exists()).toEqual(true);
      expect(icon.attributes()).toEqual(
        expect.objectContaining({
          iconname: 'googleInfoBaseline',
          color: '#0bb071',
          size: '24',
        }),
      );
    });
  });
});
