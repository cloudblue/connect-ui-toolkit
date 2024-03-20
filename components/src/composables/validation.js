import { computed, ref, watch } from 'vue';

export const useFieldValidation = (model, rules) => {
  const isValid = ref(true);
  const errorMessages = ref([]);

  const errorMessagesString = computed(() => {
    if (errorMessages.value.length) return `${errorMessages.value.join('. ')}.`;

    return '';
  });

  const validateField = (value) => {
    const results = rules.map((rule) => rule(value));

    if (results.every((result) => result === true)) {
      errorMessages.value = [];
      isValid.value = true;
    } else {
      errorMessages.value = results.filter((result) => typeof result === 'string');
      isValid.value = false;
    }
  };

  watch(model, validateField);

  return { isValid, errorMessages, errorMessagesString, validateField };
};
