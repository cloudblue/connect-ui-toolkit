<template>
  <div
    class="radio-input"
    @click="select"
  >
    <ui-icon
      class="radio-input__box"
      :iconName="icon"
      :color="iconColor"
    />
    <label
      class="radio-input__label"
      :class="{ 'radio-input__label_empty': !label }"
    >
      <input
        class="radio-input__input"
        type="radio"
      />
      <span class="radio-input__label-text">{{ label }}</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const emit = defineEmits(['selected']);

const props = defineProps({
  selectedValue: {
    type: String,
    required: true,
  },
  radioValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
});

const isSelected = computed(() => props.selectedValue === props.radioValue);
const icon = computed(() =>
  isSelected.value ? 'googleRadioButtonCheckedBaseline' : 'googleRadioButtonUncheckedBaseline',
);
const iconColor = computed(() => (isSelected.value ? '#2C98F0' : ''));

const select = () => {
  emit('selected', props.radioValue);
};
</script>

<style lang="stylus">
.radio-input {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}

.radio-input__box {
  flex-shrink: 0;
  cursor: pointer;
}

.radio-input__input {
  display: none;
}

.radio-input__label {
  display: block;
  margin-left: 8px;
  user-select: none;
}
.radio-input__label_empty {
  display: none;
}

.radio-input__label-text {
  margin: 0;
  font-size: 14px;
  line-height: 24px;
}
</style>
