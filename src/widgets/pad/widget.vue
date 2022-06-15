<template lang="pug">
.pad(v-show="opened")
  content
</template>

<script>
export default {
  inject: ['$state', '$subscribe', '$injector'],
  $attrs: ['pad', 'default'],

  computed: {
    opened: vm => vm.requested ? vm.requested === vm.$state.pad : typeof vm.$state.default === 'string',
  },

  data() {
    return {
      requested: null,
    };
  },

  created() {
    this.$subscribe('open-pad', ({ pad }) => (this.requested = pad));
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


