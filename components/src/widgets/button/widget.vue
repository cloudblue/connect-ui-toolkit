<template>
  <button
    class="button"
    :class="computedClasses"
    :disabled="disabled"
    @click="onClick"
  >
    <ui-icon
      v-if="onlyIcon"
      :iconName="leftIcon"
      :size="iconSize"
      :color="iconColor"
    />
    <template v-else>
      <span
        v-if="leftIcon"
        class="button__slot button__slot_left"
      >
        <ui-icon
          :iconName="leftIcon"
          :size="iconSize"
          :color="iconColor"
        />
      </span>
      <span
        class="button__content"
        :class="{ button__content_loading: showCenterProgress }"
      >
        <ui-icon
          v-if="showCenterProgress"
          :color="iconColor"
          :size="centralIconSize"
          iconName="connectLoaderAnimated"
        />
        <slot>{{ label }}</slot>
      </span>
      <span
        v-if="rightIcon"
        class="button__slot button__slot_right"
      >
        <ui-icon
          :iconName="rightIcon"
          :size="iconSize"
          :color="iconColor"
        />
      </span>
    </template>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import tinycolor from 'tinycolor2';

import iconComponent from '~widgets/icon/widget.vue';
import registerWidget from '~core/registerWidget';
registerWidget('ui-icon', iconComponent);

const emit = defineEmits(['clicked']);

const props = defineProps({
  mode: {
    type: String,
    default: 'solid',
    validator: (value) => ['solid', 'flat', 'outlined'].includes(value),
  },
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['small', 'large'].includes(value),
  },

  label: {
    type: String,
    default: '',
  },

  icon: {
    type: String,
    default: '',
  },
  iconRight: {
    type: String,
    default: '',
  },

  color: {
    type: String,
    default: '',
  },

  progress: {
    type: Boolean,
    default: false,
  },

  lowerCase: {
    type: Boolean,
    default: false,
  },

  onlyIcon: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
});

const mainColor = computed(() => {
  if (props.color) return props.color;
  if (props.mode === 'solid') return '#2C98F0';
  return '#212121';
});

const colors = computed(() => {
  const colorObject = tinycolor(mainColor.value);

  return {
    main: mainColor.value,
    contrast: colorObject.getBrightness() < 160 ? 'white' : 'black',
    light: colorObject.clone().lighten(20),
    translucent: colorObject.clone().setAlpha(0.1),
    disabled: '#BDBDBD',
    disabledAlt: '#F2F2F2',
  };
});

const largeIconSize = computed(() => (props.onlyIcon ? 24 : 18));
const smallIconSize = computed(() => (props.onlyIcon ? 18 : 14));
const iconSize = computed(() =>
  props.size === 'large' ? largeIconSize.value : smallIconSize.value,
);
const centralIconSize = computed(() => (props.size === 'large' ? 24 : 18));
const iconColor = computed(() => {
  if (props.disabled) return colors.value.disabled;
  if (props.mode === 'solid') return colors.value.contrast;
  return colors.value.main;
});

const showLeftProgress = computed(() => Boolean(props.icon && props.progress));
const showRightProgress = computed(() => Boolean(!props.icon && props.iconRight && props.progress));
const showCenterProgress = computed(() =>
  Boolean(!props.icon && !props.iconRight && props.progress),
);

const leftIcon = computed(() => (showLeftProgress.value ? 'connectLoaderAnimated' : props.icon));
const rightIcon = computed(() =>
  showRightProgress.value ? 'connectLoaderAnimated' : props.iconRight,
);

const computedClasses = computed(() => [
  {
    button_icon: props.onlyIcon,
    button_disabled: props.disabled,
    button_lowercase: props.lowerCase,
  },
  `button_${props.mode}`,
  `button_${props.size}`,
]);

const onClick = () => {
  if (props.disabled || props.progress) return;

  emit('clicked');
};
</script>

<style scoped lang="stylus">
.button {
  // reset styles
  all: unset;
  outline: revert;

  // declare variables
  --color-main: v-bind('colors.main');
  --color-contrast: v-bind('colors.contrast');
  --color-light: v-bind('colors.light');
  --color-translucent: v-bind('colors.translucent');
  --color-disabled: v-bind('colors.disabled');
  --color-disabled-alt: v-bind('colors.disabledAlt');

  // default styles
  position: relative;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;

  &_solid {
    border-color: var(--color-main);
    background-color: var(--color-main);
    color: var(--color-contrast);

    &:hover {
      border-color: var(--color-light);
      background-color: var(--color-light);
    }

    &.button_disabled {
      border-color: var(--color-disabled-alt);
      background-color: var(--color-disabled-alt);
      color: var(--color-disabled);
    }
  }

  &_flat {
    background-color: transparent;
    color: var(--color-main);

    &:hover {
      background-color: var(--color-translucent);
    }

    &.button_disabled {
      background-color: transparent;
      color: var(--color-disabled);
    }
  }

  &_outlined {
    border-color: #E0E0E0;
    background-color: white;
    color: var(--color-main);

    &:hover {
      background-color: var(--color-translucent);
    }

    &.button_disabled {
      background-color: white;
      color: var(--color-disabled);
    }
  }

  &_large {
    height: 36px;
    min-width: 36px;
    padding: 0 16px;
    font-size: 14px;
    letter-spacing: 0.6px;

    .button__slot_left {
      margin-left: -4px;
      margin-right: 8px;
    }

    .button__slot_right {
      margin-left: 8px;
      margin-right: -4px;
    }
  }

  &_small {
    height: 28px;
    min-width: 28px;
    padding: 0 10px;
    font-size: 12px;
    letter-spacing: 0.5px;

    .button__slot_left {
      margin-left: -2px;
      margin-right: 4px;
    }

    .button__slot_right {
      margin-left: 4px;
      margin-right: -2px;
    }
  }

  &_icon {
    padding: 0;
    justify-content: center;
  }

  &_lowercase {
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
  }

  &_disabled {
    cursor: default;
  }

  &__slot {
    flex-shrink: 0;
  }

  &__content {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    ui-icon {
      position: absolute;
    }

    &_loading slot {
      visibility: hidden;
    }
  }
}
</style>
