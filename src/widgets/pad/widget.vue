<template lang="pug">
.pad(v-show="opened")
  slot
</template>

<script>
export default {
  inject: ['$boiler', '$injector'],

  props: {
    pad: String,
    default: Boolean,
  },

  computed: {
    opened: vm => vm.requested ? vm.requested === vm.pad : vm.default,
  },

  data() {
    return {
      requested: null,
    };
  },

  created() {
    this.$boiler.subscribe('open-pad', ({ pad }) => (this.requested = pad));
  },

  watch: {
    async opened(v) {
      if (v) {
        await this.$nextTick();
        this.$injector('$size')
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.pad {
  border-top: 1px solid #e0e0e0;
  padding-top: 32px;
}
</style>


