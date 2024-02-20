<template>
  <div
    ref="menu"
    class="menu"
  >
    <div
      class="menu-trigger"
      @click.stop="toggle"
    >
      <slot name="trigger" />
    </div>

    <div class="menu-content-wrapper">
      <div
        v-if="showMenu"
        class="menu-content"
        :class="alignmentClass"
        @click.stop
      >
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'

const props = defineProps({
  align: {
    type: String,
    default: 'left',
    validator(value) {
      return ['left', 'right'].includes(value);
    },
  },
});

const showMenu = ref(false);
const menu = ref(null);

const alignmentClass = computed(() => (props.align === 'left'
  ? 'menu-content_align-left'
  : 'menu-content_align-right'
));

const toggle = () => {
  showMenu.value = !showMenu.value;
};

const handleClickOutside = (event) => {
  if (menu.value && !menu.value.contains(event.target)) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="stylus" scoped>
.menu-content-wrapper {
  position: relative;
}

.menu-content {
  position: absolute;
  top: 0;

  &_align-right {
    right: 0;
  }
  &_align-left {
    left: 0;
  }
}
</style>
