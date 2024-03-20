<template>
  <div
    ref="menu"
    class="menu"
  >
    <div
      class="menu-trigger"
      @click="toggle"
    >
      <slot name="trigger" />
    </div>

    <div class="menu-content-wrapper">
      <div
        v-if="showMenu"
        class="menu-content"
        :class="[alignmentClass, fullWidthClass]"
        @click.stop="onClickInside"
      >
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';

const props = defineProps({
  align: {
    type: String,
    default: 'left',
    validator(value) {
      return ['left', 'right'].includes(value);
    },
  },
  closeOnClickInside: {
    type: Boolean,
    default: true,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['opened', 'closed']);

const showMenu = ref(false);
const menu = ref(null);

const alignmentClass = computed(() =>
  props.align === 'left' ? 'menu-content_align-left' : 'menu-content_align-right',
);

const fullWidthClass = computed(() => (props.fullWidth ? 'menu-content_full-width' : ''));

const toggle = () => {
  showMenu.value = !showMenu.value;
  emit(showMenu.value ? 'opened' : 'closed');
};

const handleClickOutside = (event) => {
  const isClickWithinMenuBounds = event.composedPath().some((el) => el === menu.value);
  if (!isClickWithinMenuBounds) {
    showMenu.value = false;
    emit('closed');
  }
};

const onClickInside = () => {
  if (props.closeOnClickInside) {
    showMenu.value = false;
    emit('closed');
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="stylus" scoped>
.menu-content-wrapper {
  position: relative;
}

.menu-content {
  position: absolute;
  top: 0;
  width: max-content;

  &_align-right {
    right: 0;
  }

  &_align-left {
    left: 0;
  }

  &_full-width {
    width: 100%;
  }
}
</style>
