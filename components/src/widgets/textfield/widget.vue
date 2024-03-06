<template>
  <div
    class="text-field"
    :class="{ 'text-field_focused': isFocused }"
    @focusin="setFocus"
    @focusout="removeFocus"
  >
    <label for="textfield">{{ label }}</label>
    <div class="text-field__wrapper">
      <div class="text-field__body">
        <input
          v-model="localValue"
          class="text-field__input"
          :class="{ 'text-field__input_right': suffix }"
          :placeholder="placeholder"
          name="textfield"
          type="text"
          @input.stop
        />
        <span
          v-if="suffix"
          class="text-field__suffix"
          >{{ suffix }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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
});

const localValue = ref('');

const isFocused = ref(false);
const emit = defineEmits(['input']);

const removeFocus = () => (isFocused.value = false);
const setFocus = () => (isFocused.value = true);

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
    font-weight 500;
    font-size: 14px;
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
      border-width: 2px ;
    }
  }

  &__input {
    flex-grow: 1;
    outline: none;
    border-style: none;
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
}
</style>
