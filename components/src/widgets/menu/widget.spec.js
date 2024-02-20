import { mount } from '@vue/test-utils'
import Menu from './widget';

describe('Menu component', () => {
  describe('methods', () => {
    describe('#toggle', () => {
      it('toggles menu to true when clicking', () => {
        const wrapper = mount(Menu);
        wrapper.vm.showMenu = false;
        wrapper.vm.toggle(wrapper.vm.showMenu);

        expect(wrapper.vm.showMenu).toBe(true);
      });

      it('toggles menu back to false when clicking', () => {
        const wrapper = mount(Menu);
        wrapper.vm.showMenu = true;
        wrapper.vm.toggle(wrapper.vm.showMenu);

        expect(wrapper.vm.showMenu).toBe(false);
      });
    });

    describe('#handleClickOutside', () => {

      it('hides menu content when clicked outside menu', () => {
        const event = { target: 'another value'};
        const wrapper = mount(Menu);
        wrapper.vm.menu = { contains: jest.fn().mockReturnValue(false) };
        wrapper.vm.showMenu = true;
        wrapper.vm.handleClickOutside(event);

        expect(wrapper.vm.showMenu).toBe(false);
      });

      it('does not hide menu content when clicked inside menu', () => {
        const event = { target: 'some value'};
        const wrapper = mount(Menu);
        wrapper.vm.menu = { contains: jest.fn().mockReturnValue(true) };
        wrapper.vm.showMenu = true;
        wrapper.vm.handleClickOutside(event);

        expect(wrapper.vm.showMenu).toBe(true);
      });
    });
  });

  describe('onMounted', () => {
    it('adds up event listener on component mount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      mount(Menu);

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });
  });

  describe('onUnmounted', () => {
    it('cleans up event listener on component unmount', async () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const wrapper = mount(Menu);
      await wrapper.unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('alignment class', () => {
    it('sets the "menu-content_align-right" class if align=right', async () => {
      const wrapper = mount(Menu, {
        props: {
          align: 'right',
        },
      });

      // Open menu
      await wrapper.find('.menu-trigger').trigger('click');

      expect(wrapper.find('.menu-content_align-right').exists()).toEqual(true);
    });

    it('sets the "menu-content_align-left" class if align=left', async () => {
      const wrapper = mount(Menu, {
        props: {
          align: 'left',
        },
      });

      // Open menu
      await wrapper.find('.menu-trigger').trigger('click');

      expect(wrapper.find('.menu-content_align-left').exists()).toEqual(true);
    });
  });

  describe('align prop validator', () => {
    it.each([
      // expected, value
      [true, 'left'],
      [true, 'right'],
      [false, 'center'],
      [false, 'foo'],
    ])(
      'returns %s if the prop value is %s',
      (expected, value) => {
        const result = Menu.props.align.validator(value);

        expect(result).toEqual(expected);
      },
    );
  });
});
