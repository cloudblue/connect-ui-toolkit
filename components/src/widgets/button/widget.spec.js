import { mount } from '@vue/test-utils';
import Button from './widget';

describe('Button widget', () => {
  let wrapper;

  describe('render', () => {
    describe('base component', () => {
      it('renders the default button with a label', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_solid', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button with a slot', () => {
        wrapper = mount(Button, {
          slots: {
            default: 'Bar',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_solid', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__content').text()).toEqual('Bar');
      });

      it('renders the button with a label and a left icon', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            icon: 'googleCheckBaseline',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_solid', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__slot_left ui-icon').attributes()).toEqual(
          expect.objectContaining({
            'icon-name': 'googleCheckBaseline',
            size: '18',
            color: 'white',
          }),
        );
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button with a label and a right icon', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            iconRight: 'googleCheckBaseline',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_solid', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__slot_right ui-icon').attributes()).toEqual(
          expect.objectContaining({
            'icon-name': 'googleCheckBaseline',
            size: '18',
            color: 'white',
          }),
        );
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button with a label, a left icon and a right icon', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            icon: 'googleCheckBaseline',
            iconRight: 'googleArrowDropDownBaseline',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_solid', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__slot_left ui-icon').attributes()).toEqual(
          expect.objectContaining({
            'icon-name': 'googleCheckBaseline',
            size: '18',
            color: 'white',
          }),
        );
        expect(wrapper.get('.button__slot_right ui-icon').attributes()).toEqual(
          expect.objectContaining({
            'icon-name': 'googleArrowDropDownBaseline',
            size: '18',
            color: 'white',
          }),
        );
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button, disabled', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            disabled: true,
          },
        });

        expect(wrapper.classes()).toEqual([
          'button',
          'button_disabled',
          'button_solid',
          'button_large',
        ]);
        expect(wrapper.attributes('disabled')).toEqual('');
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button, lowercase', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            lowerCase: true,
          },
        });

        expect(wrapper.classes()).toEqual([
          'button',
          'button_lowercase',
          'button_solid',
          'button_large',
        ]);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button, small', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            size: 'small',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_solid', 'button_small']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button, flat', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            mode: 'flat',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_flat', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button, small, flat', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            size: 'small',
            mode: 'flat',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_flat', 'button_small']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button, outlined', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            mode: 'outlined',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_outlined', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button, small, outlined', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            size: 'small',
            mode: 'outlined',
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_outlined', 'button_small']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button in progress', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            progress: true,
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_solid', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.get('.button__content > ui-icon').attributes()).toEqual(
          expect.objectContaining({
            'icon-name': 'connectLoaderAnimated',
            size: '24',
            color: 'white',
          }),
        );
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button with a left icon, in progress', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            icon: 'googleCheckBaseline',
            progress: true,
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_solid', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__slot_left ui-icon').attributes()).toEqual(
          expect.objectContaining({
            'icon-name': 'connectLoaderAnimated',
            size: '18',
            color: 'white',
          }),
        );
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });

      it('renders the button with a right icon, in progress', () => {
        wrapper = mount(Button, {
          props: {
            label: 'Foo',
            iconRight: 'googleCheckBaseline',
            progress: true,
          },
        });

        expect(wrapper.classes()).toEqual(['button', 'button_solid', 'button_large']);
        expect(wrapper.find('.button > ui-icon').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__content > ui-icon').exists()).toBeFalsy();
        expect(wrapper.get('.button__slot_right ui-icon').attributes()).toEqual(
          expect.objectContaining({
            'icon-name': 'connectLoaderAnimated',
            size: '18',
            color: 'white',
          }),
        );
        expect(wrapper.get('.button__content').text()).toEqual('Foo');
      });
    });

    describe('icon only', () => {
      beforeEach(() => {
        wrapper = mount(Button, {
          props: {
            onlyIcon: true,
            icon: 'googleCheckBaseline',
          },
        });
      });

      it('renders the button with the icon', () => {
        expect(wrapper.classes()).toContain('button_icon');
        expect(wrapper.find('.button ui-icon').attributes()).toEqual(
          expect.objectContaining({
            'icon-name': 'googleCheckBaseline',
            size: '24',
            color: 'white',
          }),
        );
        expect(wrapper.find('.button__slot_left').exists()).toBeFalsy();
        expect(wrapper.find('.button__slot_right').exists()).toBeFalsy();
        expect(wrapper.find('.button__content').exists()).toBeFalsy();
      });

      it('renders the button with the icon and the small size', async () => {
        await wrapper.setProps({
          size: 'small',
        });

        expect(wrapper.classes()).toContain('button_icon');
        expect(wrapper.classes()).toContain('button_small');
        expect(wrapper.find('.button ui-icon').attributes()).toEqual(
          expect.objectContaining({
            'icon-name': 'googleCheckBaseline',
            size: '18',
            color: 'white',
          }),
        );
      });

      it('renders the button with the progress icon', async () => {
        await wrapper.setProps({
          progress: true,
        });

        expect(wrapper.find('.button ui-icon').attributes('icon-name')).toEqual(
          'connectLoaderAnimated',
        );
      });
    });
  });

  describe('actions', () => {
    describe('click', () => {
      it('does not emit the "clicked" event if disabled is true', async () => {
        wrapper = mount(Button, {
          props: {
            label: 'btn',
            disabled: true,
          },
        });

        await wrapper.trigger('click');

        expect(wrapper.emitted().clicked).toBeFalsy();
      });

      it('does not emit the "clicked" event if progress is true', async () => {
        wrapper = mount(Button, {
          props: {
            label: 'btn',
            progress: true,
          },
        });

        await wrapper.trigger('click');

        expect(wrapper.emitted().clicked).toBeFalsy();
      });

      it('emits the "clicked" event if progress and disabled are false', async () => {
        wrapper = mount(Button, {
          props: {
            label: 'btn',
            progress: false,
            disabled: false,
          },
        });

        await wrapper.trigger('click');

        expect(wrapper.emitted().clicked).toBeTruthy();
      });
    });
  });
});
