<!-- eslint-disable vue/no-v-html -->
<template>
  <span
    class="icon"
    :style="styles"
    v-html="icon"
  />
</template>

<script setup>
import { defineOptions, computed } from 'vue';
import * as icons from '@cloudblueconnect/material-svg';
defineOptions({
  name: 'Icon',
});
const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#757575',
  },
  size: {
    type: [Number, String],
    default: '24',
  },
});
const addUnits = (value) => {
  const regex = /^-?\d+$/;
  if (!regex.test(value)) return value;
  return `${value}px`;
};
const styles = computed(() => {
  return {
    color: props.color,
    height: addUnits(props.size),
    width: addUnits(props.size),
  };
});

const icon = computed(() => {
  return icons[props.iconName];
});
</script>

<style lang="stylus">
.icon {
  color: #757575;
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon svg {
  color: inherit;
  caret-color: currentColor;

  fill: currentColor;
  vertical-align: text-bottom;
  height: inherit;
  width: inherit;
}
</style>
