<!-- eslint-disable vue/no-v-html -->
<template>
  <button
    :disabled="disabled"
    :style="style"
  >
    <slot>
      {{ text }}
    </slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

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
})

const style = computed(() => `
  background-color: ${props.backgroundColor};
  color: ${props.color};
`);
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
    opacity: 0.5;
  }
}
</style>


