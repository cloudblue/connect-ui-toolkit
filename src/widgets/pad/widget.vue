<template lang="pug">
.pad(v-if="opened")
  slot

</template>

<script>
export default {
  props: {
    pad: String,
    active: Boolean,
  },

  computed: {
    opened: vm => vm.requested ? vm.requested === vm.pad : vm.active,
  },

  data() {
    return {
      requested: null,
    };
  },

  created() {
    this.$bus.on('click-tab', tab => (this.requested = tab));
  },

  watch: {
    async opened(v) {
      if (v) {
        await this.$nextTick();
        this.$injector('$size');
      }
    },
  },
};

</script>

<style lang="stylus" scoped>
.pad {
  border-top: 1px solid #e0e0e0;
  padding-top: 32px;
}
</style>


