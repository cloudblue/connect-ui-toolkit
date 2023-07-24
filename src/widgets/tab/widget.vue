<template lang="pug">
.tab(:class="{ active: selected }" @click="open")
  slot

</template>

<script>
export default {
  props: {
    active: Boolean,
    tab: String,
  },

  computed: {
    selected: vm => vm.requested ? vm.requested === vm.tab : vm.active,
  },

  data() {
    return {
      requested: null,
    };
  },

  methods: {
    open() {
      this.$bus.emit('click-tab', this.tab);
    },
  },

  created() {
    this.$bus.on('click-tab', tab => (this.requested = tab));
  },

  mounted() {
    if (this.active) this.open();
  },
};

</script>

<style lang="stylus" scoped>
.tab {
  display: inline-flex;
  flexDirection: row;
  position: relative;
  alignItems: center;
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
