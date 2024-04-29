<template>
  <div
    class="alert-holder"
    :class="`alert_${type}`"
  >
    <div class="alert">
      <div class="alert__icon">
        <ui-icon
          :iconName="icon"
          :color="typeAlert[type]"
          size="24"
        />
      </div>
      <div class="alert__text">
        <slot name="message"> {{ message }} </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },

  icon: {
    type: String,
    default: 'googleInfoBaseline',
  },

  type: {
    type: String,
    default: 'default',
  },
});

const typeAlert = {
  info: '#0055ff',
  error: '#FF6A6A',
  success: '#0bb071',
  warning: '#FFC700',
  default: '#bdbdbd',
};
</script>

<style lang="stylus">
.alert-holder {
  width: 100%;
  /* #bdbdbd */
  background-color: rgba(189, 189, 189, 0.15);
}
.alert {
  align-items: center;
  box-sizing: border-box;
  display: inline-flex;
  min-height: 64px;
  min-width: 240px;
  max-width: 600px;
  padding: 16px;
  border-radius: 2px;
  color: #bdbdbd;
}

.alert_error {
  /* #FF6A6A */
  background-color: rgba(255, 106, 106, 0.2);
}

.alert_info {
  /* 0, 85, 255 */
  background-color: rgba(0, 85, 255, 0.15);
}
.alert_success {
  /* #0bb071 */
  background-color: rgba(11, 176, 113, 0.15);
}
.alert_warning {
  /* #FFC700 */
  background-color: rgba(255, 199, 0, 0.15);
}

.alert__icon {
  flex: 0 0 auto;
  margin-right: 12px;
  display: flex;
}

.alert__text {
  flex: 1 1 auto;
  font-size: 14 px;
  line-height: 20px;
  text-align: left;
  color: #212121;
}
</style>
