<template>
  <div class="status-mark">
    <ui-icon
      class="status-mark__icon"
      :iconName="iconName"
      :color="iconColor"
      :size="iconSize"
    />
    <span class="status-mark__text"> {{ text }} </span>
  </div>
</template>

<script>
import icon from '~widgets/icon/widget.vue';
import registerWidget from '~core/registerWidget';
registerWidget('ui-icon', icon);

export default {
  props: {
    text: {
      type: String,
      default: '',
    },

    iconName: {
      type: String,
      default: '',
    },

    iconColor: {
      type: String,
      default: '#212121',
    },

    iconSize: {
      type: [Number, String],
      default: '16',
    },
  },
};
</script>

<style lang="stylus">
.status-mark {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  font-size: 14px;
  line-height: 20px;

  &__icon {
    margin-right: 4px;
    flex: 0 0 auto;
  }

  &__text {
    font-size: inherit;
    line-height: inherit;
    white-space: nowrap;
  }
}
</style>
