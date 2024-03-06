<!-- eslint-disable vue/no-v-html -->
<template>
  <button
    :disabled="disabled"
    :style="style"
    @click="onClick"
  >
    <slot>
      {{ text }}
    </slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const emit = defineEmits(['clicked']);

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  backgroundColor: {
    type: String,
    default: '#2C98F0',
  },
  color: {
    type: String,
    default: '#FFF',
  },
  height: {
    type: String,
    default: 'auto',
  },
  width: {
    type: String,
    default: 'auto',
  },
});

const style = computed(
  () => `
  background-color: ${props.backgroundColor};
  color: ${props.color};
  height: ${props.height};
  width: ${props.width};
`,
);

const onClick = () => {
  if (!props.disabled) emit('clicked');
};
</script>

<style lang="stylus">
button {
  text-transform: uppercase;
  overflow: hidden;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 2px;
  cursor: pointer;
  border-style: none;
  font-family: Roboto, "Helvetica Neue", sans-serif;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: #f2f2f2 !important;
    color: #BDBDBD !important;
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }
}
</style>
