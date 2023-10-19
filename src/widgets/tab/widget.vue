<template>
  <div
    class="tab"
    :class="{ active: selected }"
    @click="open"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,
    tab: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      requested: null,
    };
  },

  computed: {
    selected: vm => vm.requested ? vm.requested === vm.tab : vm.active,
  },

  created() {
    if (this.active) this.open();
    this.$bus.on('click-tab', tab => (this.requested = tab));
  },

  methods: {
    open() {
      this.$bus.emit('click-tab', this.tab);
    },
  },
};

</script>

<style lang="stylus" scoped>
.tab {
  display: inline-flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  margin-right: 1.6em;
  line-height: 3.2em;
  white-space: nowrap;
  color: #212121;
  cursor: pointer;
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
