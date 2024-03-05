<template>
  <div
    v-if="opened"
    class="pad"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    pad: {
      type: String,
      default: '',
    },

    active: Boolean,
  },

  data() {
    return {
      requested: null,
    };
  },

  computed: {
    opened: (vm) => (vm.requested ? vm.requested === vm.pad : vm.active),
  },

  watch: {
    async opened(v) {
      if (v) {
        await this.$nextTick();
        this.$injector('$size');
      }
    },
  },

  created() {
    this.$bus.on('click-tab', (tab) => (this.requested = tab));
  },
};
</script>

<style lang="stylus" scoped>
.pad {
  border-top: 1px solid #e0e0e0;
  padding-top: 32px;
}
</style>
