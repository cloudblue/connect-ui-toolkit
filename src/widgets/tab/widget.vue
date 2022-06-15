<template lang="pug">
.tab(:class="{ active: active }" @click="open()")
  content
</template>

<script>
export default {
  $attrs: ['tab', 'default'],

  $style: (el) => {
    const isFirstChild = el.matches('*:first-child');

    return {
      display: 'inline-flex',
      flexDirection: 'row',
      position: 'relative',
      alignItems: 'center',
      marginLeft: isFirstChild ? 0 : '1.6em',
      lineHeight: '3.2em',
      whiteSpace: 'nowrap',
      color: '#212121',
      cursor: 'pointer',
      fontWeight: '500',
    }
  },

  inject: ['$state', '$dispatch', '$subscribe'],

  computed: {
    active: vm => vm.requested ? vm.requested === vm.$state.tab : typeof vm.$state.default === 'string',
  },

  data() {
    return {
      requested: null,
    };
  },

  created() {
    this.$subscribe('open-pad', ({ pad }) => (this.requested = pad));
    if (this.$state.default) this.open();
  },

  methods: {
    open() {
      this.$dispatch('click-tab', { tab: this.$state.tab });
    },
  },
}
</script>

<style lang="stylus" scoped>
.tab {
  font-weight: 500;
  font-family: Roboto, "Helvetica Neue", sans-serif;
  letter-spacing: .5px;

  &:hover {
    color: #4797f2;
  }

  &.active {
    color: #4797f2;

    &:after {
      height: 3px;
    }
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0;
    background-color: #4797f2;
    transition: all 0.3s linear;
  }
}
</style>