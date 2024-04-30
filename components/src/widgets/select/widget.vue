<template>
  <div
    class="select-input"
    :class="computedClasses"
  >
    <div
      v-if="label"
      class="select-input__label"
    >
      <p>
        {{ label }}
        <span v-if="!required">(Optional)</span>
      </p>
    </div>
    <ui-menu
      v-bind="menuProps"
      @opened="isFocused = true"
      @closed="isFocused = false"
    >
      <div
        slot="trigger"
        class="select-input__selected"
      >
        <slot name="selected">
          <span v-if="model">{{ getDisplayText(selectedOption) }}</span>
          <span
            v-else
            class="select-input__no-selection"
          >
            —
          </span>
        </slot>
        <ui-icon
          iconName="googleArrowDropDownBaseline"
          color="#666666"
          size="24"
        />
      </div>
      <div
        slot="content"
        class="select-input__menu"
        :style="{ maxHeight }"
      >
        <div
          v-for="option in computedOptions"
          :key="option[propValue]"
          class="select-input__option"
          :class="{ 'select-input__option_selected': option[propValue] === model }"
          @click="setSelected(option)"
        >
          <span>{{ getDisplayText(option) }}</span>
        </div>
      </div>
    </ui-menu>
    <div
      v-if="hint || !isValid"
      class="select-input__hint"
    >
      <p
        v-if="!isValid"
        class="select-input__error-message"
      >
        {{ errorMessagesString }}
      </p>
      <p v-else>{{ hint }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import Menu from '~widgets/menu/widget.vue';
import Icon from '~widgets/icon/widget.vue';
import { useFieldValidation } from '~composables/validation';
import registerWidget from '~core/registerWidget';

registerWidget('ui-menu', Menu);
registerWidget('ui-icon', Icon);

const model = defineModel({
  type: String,
  required: true,
});

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  propValue: {
    type: String,
    default: 'id',
  },
  propText: {
    type: String,
    default: 'id',
  },
  optionTextFn: {
    type: Function,
    default: null,
  },
  hint: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  maxHeight: {
    type: String,
    default: '200px',
  },
  menuProps: {
    type: Object,
    default: () => ({
      fullWidth: true,
    }),
  },
  rules: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['valueChange']);

const { isValid, errorMessagesString } = useFieldValidation(model, props.rules);

const isFocused = ref(false);

const computedClasses = computed(() => ({
  'select-input_focused': isFocused.value,
  'select-input_invalid': !isValid.value,
}));

const computedOptions = computed(() =>
  props.options.map((option) => {
    if (option && typeof option === 'object') return option;
    return { id: option };
  }),
);

const selectedOption = computed(() =>
  computedOptions.value.find((option) => option[props.propValue] === model.value),
);

const setSelected = (option) => {
  const value = option[props.propValue];
  model.value = value;
  emit('valueChange', value);
};

const getDisplayText = (item) => {
  if (props.optionTextFn) return props.optionTextFn(item);
  return item[props.propText];
};
</script>

<style lang="stylus" scoped>
.select-input {
  color: #212121;

  &__selected {
    height: 44px;
    border-radius: 2px;
    border: 1px solid #d8d8d8;
    background-color: #fbfbfb;
    display: flex;
    padding: 4px 12px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    cursor: pointer;

    .select-input_focused & {
      border-color: #4797f2;
      outline: 1px solid #4797f2;
    }

    .select-input_invalid & {
      border-color: #FF6A6A;
    }

    .select-input_focused.select-input_invalid & {
      outline: 1px solid #FF6A6A;
    }
  }

  &__menu {
    position: relative;
    overflow: hidden auto;
    z-index: 1;
    padding: 16px 0;
    border: 1px solid #d8d8d8;
    border-radius: 2px;
    background-color: #fbfbfb;
    box-shadow: 0 4px 20px 0 #00000040;
  }

  &__option {
    height: 48px;
    display: flex;
    align-items: center;
    padding: 4px 12px;
    box-sizing: border-box;
    cursor: pointer;

    &_selected {
      color: #2c98f0;
      background-color: #2C98F027;
    }
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

    .select-input__error-message {
      color: #FF6A6A;
    }
  }

  &__label {
    margin-bottom: 8px;

    p {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      margin: 0;
    }
  }

  &__no-selection {
    color: #707070;
  }
}
</style>
