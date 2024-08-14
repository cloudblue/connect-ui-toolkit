<template>
  <div
    class="text-field"
    :class="computedClasses"
    @click="setFocus"
  >
    <label
      v-if="label"
      for="textfield"
    >
      {{ label }}
      <span v-if="!required">(Optional)</span>
    </label>
    <div
      class="text-field__wrapper"
      @focusout="removeFocus"
    >
      <div class="text-field__body">
        <input
          ref="inputEl"
          v-model="localValue"
          class="text-field__input"
          :class="{ 'text-field__input_right': suffix }"
          :placeholder="placeholder"
          name="textfield"
          type="text"
          :autocomplete="browserAutocomplete ? 'on' : 'off'"
          @focus="setFocus"
          @input.stop
        />
        <span
          v-if="suffix"
          class="text-field__suffix"
        >
          {{ suffix }}
        </span>
      </div>
    </div>
    <div
      v-if="hint || !isValid"
      class="text-field__hint"
    >
      <p
        v-if="!isValid"
        class="text-field__error-message"
      >
        {{ errorMessagesString }}
      </p>
      <p v-else>{{ hint }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useFieldValidation } from '~composables/validation';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
  noBorders: {
    type: Boolean,
    default: false,
  },
  browserAutocomplete: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['input']);

const localValue = ref('');

const { isValid, errorMessagesString } = useFieldValidation(localValue, props.rules);

const inputEl = ref(null);
const isFocused = ref(false);

const computedClasses = computed(() => ({
  'text-field_focused': isFocused.value,
  'text-field_invalid': !isValid.value,
  'text-field_no-borders': props.noBorders,
}));

const removeFocus = () => (isFocused.value = false);
const setFocus = () => {
  isFocused.value = true;
  inputEl.value.focus();
};

watch(
  () => props.value,
  (newValue) => {
    localValue.value = newValue;
  },
  { immediate: true },
);

watch(localValue, (newValue) => {
  emit('input', newValue);
});
</script>

<style lang="stylus">
@import '../../assets/styles/common.styl';

.text-field {
  font-family: 'Roboto';
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  display: flex;
  flex-flow: column nowrap;
  color: base-text-color;

  label {
    margin-bottom: 8px;
    font-weight 500;
    font-size: 14px;
    line-height: 1.4;
  }

  &__body {
    flex-grow: 1;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    max-height: 44px;
    padding: 11px;
    border: 1px solid #D8D8D8;
    border-radius: 2px;
    background-color: #FBFBFB;
    cursor: pointer;

    .text-field_disabled &,
    [disabled] &,
    :disabled & {
      border-style: dashed;
      cursor: default;
    }

    .text-field_focused & {
      border-color: #4797f2;
      outline: 1px solid #4797f2;
    }

    .text-field_invalid & {
      border-color: #FF6A6A;
    }

    .text-field_focused.text-field_invalid & {
      outline: 1px solid #FF6A6A;
    }

    .text-field_no-borders & {
      border: unset !important;
      outline: unset !important;
    }
  }

  &__input {
    max-width: 100%;
    flex-grow: 1;
    outline: none;
    border-style: none;
    padding: 0;
    background-color: transparent;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #212121;

    &:hover,
    &:focus {
      outline: none;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px  #FBFBFB inset !important;
    }

    &::placeholder {
      color: #707070;
    }

    .text-field_disabled & {
      color: #BDBDBD;
    }

    &_right {
      text-align: right;
    }
  }

  &__suffix {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #707070;
  }

  &__hint {
    margin-top: 4px;

    p {
      color: #707070;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.3;
      margin: 0;
    }

    .text-field__error-message {
      color: #FF6A6A;
    }
  }
}
</style>
