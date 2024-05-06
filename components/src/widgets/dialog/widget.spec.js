import SimpleDialog from './widget.vue';
import { ACTIONS_DICT } from '~constants/dialogs.js';
import { COLORS_DICT } from '~constants/color.js';
import { shallowMount } from '@vue/test-utils';

describe('SimpleDialog component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SimpleDialog, {
      props: {
        value: true,
        title: 'My dialog',
        actions: [ACTIONS_DICT.CLOSE, ACTIONS_DICT.SAVE],
      },
      slots: {
        default: '<p>Default slot content</p>',
      },
      shallow: true,
      global: {
        renderStubDefaultSlot: true,
      },
    });
  });

  describe('props validation', () => {
    describe('actions prop validator', () => {
      it.each([
        // expected, value
        [true, Object.values(ACTIONS_DICT)],
        [true, [ACTIONS_DICT.CLOSE, ACTIONS_DICT.SPACER, ACTIONS_DICT.BACK, ACTIONS_DICT.NEXT]],
        [false, ['foo']],
        [false, ['foo', ACTIONS_DICT.SUBMIT]],
        ...Object.values(ACTIONS_DICT).map((action) => [true, [action]]),
      ])('returns %s if the prop actions is %s', (expected, value) => {
        const result = SimpleDialog.props.actions.validator(value);

        expect(result).toEqual(expected);
      });
    });
  });

  describe('render', () => {
    test('renders the base component', () => {
      expect(wrapper.get('.dialog__title').text()).toEqual('My dialog');
      expect(wrapper.find('.dialog__sidebar').exists()).toBeFalsy();
      expect(wrapper.get('.dialog__content').text()).toEqual('Default slot content');
    });

    test('renders the header if using the header slot', () => {
      wrapper = shallowMount(SimpleDialog, {
        props: {
          value: true,
          title: 'My dialog',
          actions: [ACTIONS_DICT.CLOSE, ACTIONS_DICT.SAVE],
        },
        slots: {
          default: '<p>Default slot content</p>',
          header: '<p>My custom header</p>',
        },
        shallow: true,
        global: {
          renderStubDefaultSlot: true,
        },
      });

      expect(wrapper.get('.dialog__header').text()).toEqual('My custom header');
    });

    test('renders the sidebar if using the sidebar slot', () => {
      wrapper = shallowMount(SimpleDialog, {
        props: {
          value: true,
          title: 'My dialog',
          actions: [ACTIONS_DICT.CLOSE, ACTIONS_DICT.SAVE],
        },
        slots: {
          default: '<p>Default slot content</p>',
          sidebar: '<p>My custom sidebar</p>',
        },
        shallow: true,
        global: {
          renderStubDefaultSlot: true,
        },
      });

      expect(wrapper.get('.dialog__sidebar').text()).toEqual('My custom sidebar');
    });
  });

  describe('action buttons', () => {
    beforeEach(() => {
      wrapper = shallowMount(SimpleDialog, {
        props: {
          value: true,
          title: 'My dialog',
          actions: [],
        },
        slots: {
          default: '<p>Default slot content</p>',
        },
        shallow: true,
        global: {
          renderStubDefaultSlot: true,
        },
      });
    });

    describe('cancel action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: [ACTIONS_DICT.CANCEL],
        });
      });

      test('renders the cancel action button', () => {
        const cancelButton = wrapper.get('.dialog__action');

        expect(cancelButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.TEXT,
            label: 'Cancel',
            mode: 'flat',
          }),
        );
      });

      test('closes the dialog when clicked', async () => {
        const cancelButton = wrapper.get('.dialog__action');

        await cancelButton.trigger('clicked');

        expect(wrapper.emitted().closed).toBeTruthy();
      });
    });

    describe('close action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: [ACTIONS_DICT.CLOSE],
        });
      });

      test('renders the close action button', () => {
        const closeButton = wrapper.get('.dialog__action');

        expect(closeButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.TEXT,
            label: 'Close',
            mode: 'flat',
          }),
        );
      });

      test('closes the dialog when clicked', async () => {
        const closeButton = wrapper.get('.dialog__action');

        await closeButton.trigger('clicked');

        expect(wrapper.emitted().closed).toBeTruthy();
      });
    });

    describe('spacer action', () => {
      test('renders the spacer element', async () => {
        await wrapper.setProps({
          actions: [ACTIONS_DICT.SPACER],
        });

        expect(wrapper.find('.dialog__spacer').exists()).toBeTruthy();
      });
    });

    describe('next action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: [ACTIONS_DICT.NEXT],
        });
      });

      test('renders the next action button', () => {
        const nextButton = wrapper.get('.dialog__action');

        expect(nextButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            label: 'Next',
            mode: 'flat',
          }),
        );
      });

      test('renders the next action button disabled if "isValid" is falsy', async () => {
        await wrapper.setProps({
          isValid: false,
        });

        const nextButton = wrapper.get('.dialog__action');

        expect(nextButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: '',
            label: 'Next',
            mode: 'flat',
          }),
        );
      });

      test('emits the "next" event when clicked', async () => {
        const nextButton = wrapper.get('.dialog__action');

        await nextButton.trigger('clicked');

        expect(wrapper.emitted().next).toBeTruthy();
      });
    });

    describe('back action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: [ACTIONS_DICT.BACK],
        });
      });

      test('renders the back action button', () => {
        const backButton = wrapper.get('.dialog__action');

        expect(backButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.TEXT,
            label: 'Back',
            mode: 'flat',
          }),
        );
      });

      test('renders the back action button disabled if "backDisabled" is truthy', async () => {
        await wrapper.setProps({
          backDisabled: true,
        });

        const backButton = wrapper.get('.dialog__action');

        expect(backButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.TEXT,
            disabled: '',
            label: 'Back',
            mode: 'flat',
          }),
        );
      });

      test('emits the "back" event when clicked', async () => {
        const backButton = wrapper.get('.dialog__action');

        await backButton.trigger('clicked');

        expect(wrapper.emitted().back).toBeTruthy();
      });
    });

    describe('submit action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: [ACTIONS_DICT.SUBMIT],
          isValid: true,
        });
      });

      test('renders the submit action button', () => {
        const submitButton = wrapper.get('.dialog__action');

        expect(submitButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            label: 'Submit',
            mode: 'flat',
          }),
        );
      });

      test('renders the submit action button disabled if "isValid" is falsy', async () => {
        await wrapper.setProps({
          isValid: false,
        });

        const submitButton = wrapper.get('.dialog__action');

        expect(submitButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: '',
            label: 'Submit',
            mode: 'flat',
          }),
        );
      });

      test('renders the submit action button with the submitLabel prop as text', async () => {
        await wrapper.setProps({
          submitLabel: 'Create',
        });

        const submitButton = wrapper.get('.dialog__action');

        expect(submitButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            label: 'Create',
            mode: 'flat',
          }),
        );
      });

      describe('when the button is clicked', () => {
        beforeEach(async () => {
          const submitButton = wrapper.get('.dialog__action');
          await submitButton.trigger('clicked');
        });

        test('emits the submitted event', async () => {
          expect(wrapper.emitted().submitted).toBeTruthy();
        });
      });
    });

    describe('save action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: [ACTIONS_DICT.SAVE],
          isValid: true,
        });
      });

      test('renders the save action button', () => {
        const saveButton = wrapper.get('.dialog__action');

        expect(saveButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            label: 'Save',
            mode: 'flat',
          }),
        );
      });

      test('renders the save action button disabled if "isValid" is falsy', async () => {
        await wrapper.setProps({
          isValid: false,
        });

        const saveButton = wrapper.get('.dialog__action');

        expect(saveButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: '',
            label: 'Save',
            mode: 'flat',
          }),
        );
      });

      describe('when the button is clicked', () => {
        beforeEach(async () => {
          const saveButton = wrapper.get('.dialog__action');
          await saveButton.trigger('clicked');
        });

        test('emits the submitted event', async () => {
          expect(wrapper.emitted().submitted).toBeTruthy();
        });
      });
    });

    describe('delete action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: [ACTIONS_DICT.DELETE],
          isValid: true,
        });
      });

      test('renders the delete action button', () => {
        const deleteButton = wrapper.get('.dialog__action');

        expect(deleteButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_RED,
            label: 'Delete',
            mode: 'flat',
          }),
        );
      });

      test('renders the delete action button disabled if "isValid" is falsy', async () => {
        await wrapper.setProps({
          isValid: false,
        });

        const deleteButton = wrapper.get('.dialog__action');

        expect(deleteButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_RED,
            disabled: '',
            label: 'Delete',
            mode: 'flat',
          }),
        );
      });

      describe('when the button is clicked', () => {
        beforeEach(async () => {
          const deleteButton = wrapper.get('.dialog__action');
          await deleteButton.trigger('clicked');
        });

        test('emits the submitted event', async () => {
          expect(wrapper.emitted().submitted).toBeTruthy();
        });
      });
    });
  });
});
