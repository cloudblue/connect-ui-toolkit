<template>
  <div class="c-view">
    <div
      v-if="loading"
      class="c-view__progress-wrapper"
    >
      <slot name="loader" />
    </div>

    <template v-else>
      <ui-nav
        class="c-view__navigation"
        :assistive-title="assistiveTitle"
        :current-tab="activeTab"
        :show-back-button="showBackButton ? '' : null"
        :title="title"
        .tabs="tabs"
        @click-tab="setCurrentTab"
        @go-back="$emit('go-back')"
      >
        <slot name="tabs" />
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <div slot="actions">
          <slot name="actions" />
        </div>
      </ui-nav>

      <div class="c-view__content-holder">
        <template v-if="tabs.length">
          <template v-for="tab in tabs">
            <div
              v-if="tab.value === activeTab"
              :key="tab.value"
              class="c-view__content"
              :class="{ 'c-view__content_padded': !noPadded }"
            >
              <slot :name="tab.value" />
            </div>
          </template>
        </template>

        <div
          v-else
          class="c-view__content"
          :class="{ 'c-view__content_padded': !noPadded }"
        >
          <slot />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import navigation from '~widgets/navigation/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-nav', navigation);


export default {
  props: {
    loading: Boolean,
    noPadded: Boolean,
    currentTab: {
      type: String,
      default: '',
    },

    // navigation bar props
    assistiveTitle: {
      type: String,
      default: '',
    },

    title: {
      type: String,
      default: '',
    },

    tabs: {
      type: Array,
      default: () => [],
    },

    showBackButton: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['go-back'],

  data: () => ({
    activeTab: '',
  }),

  watch: {
    async activeTab() {
      await this.$nextTick();
      this.$injector('$size')
    },

    currentTab: {
      immediate: true,
      handler(v) {
        this.activeTab = v;
      },
    },
  },

  methods: {
    setCurrentTab({ detail: tab }) {
      // Handle current tab from parent
      if (this.currentTab) return;

      this.activeTab = tab;
    },
  },
};
</script>


<style lang="stylus">
.c-view {
  position: relative;
  flex: 1 1 100%;
  display: grid;

  grid-template-rows: min-content auto;
  grid-template-columns: 1fr;
  grid-template-areas: "n" "c";

  overflow: auto;

  &__progress-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
  }

  &__navigation {
    grid-area: n;
  }

  &__content-holder {
    position: relative;
    grid-area: c;
  }

  &__content {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
    padding-bottom: 64px;

    &_padded {
      padding: 24px 24px 40px;
    }

    &:empty {
      display: none;
    }
  }
}
</style>
