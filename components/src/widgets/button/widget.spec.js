import { mount } from '@vue/test-utils';
import Button from './widget.vue';

describe('Button widget', () => {
  let result;

  describe('computed', () => {
    describe('#style', () => {
      it('returns the styles', () => {
        const wrapper = mount(Button);

        result = wrapper.vm.style;

        expect(result).toEqual(`
  background-color: #2C98F0;
  color: #FFF;
  height: auto;
  width: auto;
`);
      });
    });
  });

  describe('methods', () => {
    describe('#onClick', () => {
      it('emits clicked event if it is not disabled', async () => {
        const wrapper = mount(Button);

        result = wrapper.vm.onClick();

        expect(wrapper.emitted('clicked')).toBeTruthy();
      });
    });
  });
});
