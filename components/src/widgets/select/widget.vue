<template>
  <div class="select-input">
    <div
      v-if="label"
      class="select-input__label"
    >
      <p>{{ label }}</p>
    </div>
    <ui-menu fullWidth>
      <div
        slot="trigger"
        class="select-input__selected"
      >
        <slot name="selected">
          <span v-if="model">{{ selectedOption[props.propText] }}</span>
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
      >
        <div
          v-for="option in computedOptions"
          :key="option[propValue]"
          class="select-input__option"
          :class="{ 'select-input__option_selected': option[propValue] === model }"
          @click="setSelected(option)"
        >
          <span>{{ option[propText] }}</span>
        </div>
      </div>
    </ui-menu>
    <div
      v-if="hint"
      class="select-input__hint"
    >
      <p>{{ hint }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Menu from '~widgets/menu/widget.vue';
import Icon from '~widgets/icon/widget.vue';
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
  hint: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['valueChange']);

const computedOptions = computed(() =>
  props.options.map((option) => {
    if (option && typeof option === 'object') return option;
    return { id: option };
  }),
);

const setSelected = (option) => {
  const value = option[props.propValue];
  model.value = value;
  emit('valueChange', value);
};

const selectedOption = computed(() =>
  computedOptions.value.find((option) => option[props.propValue] === model.value),
);
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
  }

  &__menu {
    position: relative;
    z-index: 1;
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
