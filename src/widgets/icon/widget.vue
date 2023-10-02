<template lang="pug">
span.icon(
  v-html="icon",
  :style="styles",
)
</template>

<script>
import * as icons from '@cloudblueconnect/material-svg/baseline';

export default {
  props: {
    iconName: {
      type: String,
      required: true,
    },

    color: String,
    size: [Number, String],
  },

  computed: {
    styles() {
      return {
        color: this.color,
        height: this.addUnits(this.size),
        width: this.addUnits(this.size),
      }
    },

    icon() {
      return icons[this.iconName];
    }
  },

  methods: {
    addUnits(value) {
      const regex = /^-?\d+$/;
      if (!regex.test(value)) return value;
      return `${value}px`;
    },
  },
};
</script>

<style lang="stylus">
.icon {
  color: #757575;
  height: 24px;
  width: 24px;
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

