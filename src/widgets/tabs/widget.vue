<template lang="pug">
.tabs
  .tabs__container
    slot
      .tabs__controls(v-if="tabs.length")
        .tab(
          v-for="tab in tabs",
          :key="tab.value",
          :class="linkClass(tab)",
          @click="open(tab)",
        ) {{ tab.label }}

  .tabs__content(v-if="tabs.length")
    template(v-for="tab in tabs")
      .tab__view(
        v-if="currentTab === tab.value",
        :key="tab.value",
      )
        slot(:name="tab.value")

</template>


<script>
export default {
  props: {
    currentTab: {
      type: String,
      default: '',
    },

    tabs: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    open(tab) {
      if (tab.disabled || tab.value === this.currentTab) return;

      this.$el.dispatchEvent(new CustomEvent('click-tab', { detail: tab.value, bubbles: true, composed: true }));
    },

    linkClass(tab) {
      return {
        'tab_active': tab.value === this.currentTab,
        'tab_disabled': tab.disabled,
      };
    },
  },

  mounted() {
    if (!this.currentTab && this.tabs.length) this.open(this.tabs[0]);
  },
};

</script>

<style lang="stylus" scoped>
.tabs {
  width: 100%;
  margin-top: 32px;

  &__container,
  &__content {
    width: 100%;
  }

  &__content {
    margin-top: 32px;
  }

  &__controls {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
  }

  .tab {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 24px;
    line-height: 48px;
    white-space: nowrap;
    cursor: pointer;

    color: #212121;
    font-weight: 500;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:after {
      content: '';
      height: 3px;
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;

      transform-origin: bottom;
      transform: scaleY(0);
      transition: transform 385ms cubic-bezier(0.4, 0, 0.2, 1);

      background-color: #4797f2;
    }

    &:first-child {
      margin-left: 0;
    }

    &_active {
      color: #4797f2;

      &:after {
        transform: scaleX(1);
      }
    }

    &_disabled {
      color: #bdbdbd !important;
      cursor: default !important;
    }
  }

  .tab__view {
    width: 100%;
  }
}
</style>
