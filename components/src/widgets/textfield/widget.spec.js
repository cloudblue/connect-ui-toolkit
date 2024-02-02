import Textfield from './widget';


describe('Textfield widget', () => {
  let context;
  let result;

  describe('#data', () => {
    it('returns the initial data', () => {
      result = Textfield.data();

      expect(result).toEqual({
        focused: false,
        localValue: '',
      });
    });
  });

  describe('methods', () => {
    describe('#onInput', () => {

      beforeEach(() => {
        context = {
          localValue: 'my value',
          $emit: jest.fn(),
          e: {
            stopPropagation: jest.fn(),
          },
        };

        Textfield.methods.onInput.call(context, context.e);
      });

      it('calls stop propagation from event', () => {
        expect(context.e.stopPropagation).toHaveBeenCalled();
      });

      it('emits input event with localValue', () => {
        expect(context.$emit).toHaveBeenCalledWith('input', context.localValue);
      });
    });

    describe('#removeFocus', () => {
      it('sets focused to false if focused is true', () => {
        context = {
          focused: true,
        }

        Textfield.methods.removeFocus.call(context);

        expect(context.focused).toEqual(false);
      })
    });

    describe('#setFocus', () => {
      it('sets focused to false if focused is true', () => {
        context = {
          focused: false,
        }

        Textfield.methods.setFocus.call(context);

        expect(context.focused).toEqual(true);
      })
    });
  });
});
