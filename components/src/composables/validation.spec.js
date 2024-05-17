import { ref, nextTick } from 'vue';

import { useFieldValidation } from './validation';

describe('validation composables', () => {
  describe('useFieldValidation', () => {
    let model;
    let rule;
    let rules;
    let instance;

    beforeEach(() => {
      model = ref('');
      rule = vi.fn().mockReturnValue(true);
      rules = [rule];
    });

    it('returns the required properties', () => {
      const { isValid, errorMessages, errorMessagesString, validateField } = useFieldValidation(
        model,
        rules,
      );

      expect(isValid.value).toEqual(true);
      expect(errorMessages.value).toEqual([]);
      expect(errorMessagesString.value).toEqual('');
      expect(validateField).toEqual(expect.any(Function));
    });

    describe('validateField function', () => {
      beforeEach(() => {
        instance = useFieldValidation(model, rules);
      });

      it('validates the model value against the rules', () => {
        instance.validateField('foo bar baz');

        expect(rule).toHaveBeenCalledWith('foo bar baz');
      });

      describe('if the validation is successful', () => {
        beforeEach(() => {
          rule.mockReturnValue(true);

          instance.validateField('foo bar baz');
        });

        it('sets isValid to true', () => {
          expect(instance.isValid.value).toEqual(true);
        });

        it('sets errorMessages to an empty array', () => {
          expect(instance.errorMessages.value).toEqual([]);
        });
      });

      describe('if the validation fails', () => {
        beforeEach(() => {
          rule.mockReturnValue('You failed miserably');

          instance.validateField('foo bar baz');
        });

        it('sets isValid to false', () => {
          expect(instance.isValid.value).toEqual(false);
        });

        it('sets errorMessages as an array of all failure messages', () => {
          expect(instance.errorMessages.value).toEqual(['You failed miserably']);
        });
      });
    });

    describe('when the model value changes', () => {
      beforeEach(() => {
        instance = useFieldValidation(model, rules);
      });

      it('validates the model value against the rules', async () => {
        model.value = 'foo bar baz';
        await nextTick();

        expect(rule).toHaveBeenCalledWith('foo bar baz');
      });

      describe('if the validation is successful', () => {
        beforeEach(async () => {
          rule.mockReturnValue(true);

          model.value = 'foo bar baz';
          await nextTick();
        });

        it('sets isValid to true', () => {
          expect(instance.isValid.value).toEqual(true);
        });

        it('sets errorMessages to an empty array', () => {
          expect(instance.errorMessages.value).toEqual([]);
        });
      });

      describe('if the validation fails', () => {
        beforeEach(async () => {
          rule.mockReturnValue('You failed miserably');

          model.value = 'foo bar baz';
          await nextTick();
        });

        it('sets isValid to false', () => {
          expect(instance.isValid.value).toEqual(false);
        });

        it('sets errorMessages as an array of all failure messages', () => {
          expect(instance.errorMessages.value).toEqual(['You failed miserably']);
        });
      });
    });

    describe('errorMessagesString computed', () => {
      let instance;

      beforeEach(() => {
        instance = useFieldValidation(model, rules);
      });

      it('returns an empty string if errorMessages is empty', async () => {
        instance.errorMessages.value = [];
        await nextTick();

        expect(instance.errorMessagesString.value).toEqual('');
      });

      it('returns the joined messages in errorMessages otherwise', async () => {
        instance.errorMessages.value = ['Bad value', 'Big mistake here'];
        await nextTick();

        expect(instance.errorMessagesString.value).toEqual('Bad value. Big mistake here.');
      });
    });
  });
});
