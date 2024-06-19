<template>
  <div
    class="textarea-field"
    :class="computedClasses"
    @click="setFocus"
    @focusout="removeFocus"
  >
    <label
      v-if="label"
      class="textarea-field__label"
      :for="textarea"
    >
      <slot name="label">
        <span>{{ props.label }}</span>
      </slot>
    </label>
    <textarea
      ref="txtarea"
      v-model="localValue"
      class="textarea-field__input"
      :class="{
        'textarea-field__input_no-resize': autoGrow,
        'textarea-field__input_no-border': noBorder,
      }"
      :placeholder="placeholder"
      :readonly="props.readonly"
      :rows="rows"
      name="textarea"
      @input.stop
    ></textarea>
    <div
      v-if="hint || !isValid"
      class="textarea-field__hint"
    >
      <p
        v-if="!isValid"
        class="textarea-field__error-message"
      >
        {{ errorMessagesString }}
      </p>
      <p v-else>{{ hint }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue';
import { useFieldValidation } from '~composables/validation';

const emit = defineEmits(['input']);

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  autoGrow: {
    type: Boolean,
    default: false,
  },
  noBorder: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  rows: {
    type: [Number, String],
    default: 5,
  },
  required: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array,
    default: () => [],
  },
});

const localValue = ref('');
const txtarea = ref(null);
const isFocused = ref(false);

const { isValid, errorMessagesString } = useFieldValidation(localValue, props.rules);

const calculateInputHeight = () => {
  const input = txtarea.value;
  if (input) {
    input.style.height = 0;
    const height = input.scrollHeight;
    const minHeight = parseInt(props.rows, 10) * 24;
    // This has to be done ASAP, waiting for Vue
    // to update the DOM causes ugly layout jumping
    input.style.height = `${Math.max(minHeight, height)}px`;
  }
};

const removeFocus = () => {
  isFocused.value = false;
};

const setFocus = () => {
  txtarea.value.focus();
  isFocused.value = true;
};

const computedClasses = computed(() => ({
  'textarea-field_focused': isFocused.value,
  'textarea-field_invalid': !isValid.value,
  'textarea-field_optional': !props.required,
}));

onMounted(() => {
  if (props.autoGrow) calculateInputHeight();
});

watch(
  () => props.value,
  (newValue) => {
    localValue.value = newValue;
  },
  { immediate: true },
);

watch(localValue, async (newValue) => {
  emit('input', newValue);
  await nextTick();
  if (props.autoGrow) calculateInputHeight();
});
</script>

<style lang="stylus">
@import '../../assets/styles/common.styl';

.textarea-field {
  color: base-text-color;

  &_optional label::after {
    content: '(Optional)';
    display: inline-block;
    margin-left: 3px;
    color: #212121;
    text-decoration: none;
  }

  &__input {
    box-sizing: border-box;
    width: 100%;
    background-color: #FBFBFB;
    border: 1px solid #D8D8D8;
    border-radius: 2px;
    padding: 11px;
    resize: vertical;

    &_no-resize {
      resize: none;
    }

    &_no-border {
      border: none;
      outline: none;
    }
  }

  &__label {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    display: flex;
    margin-bottom: 8px;
  }

  &_focused textarea {
    border-color: #4797f2;
    outline: 1px solid #4797f2;
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

    .textarea-field__error-message {
      color: #FF6A6A;
    }
  }
}
</style>
