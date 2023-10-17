<template>
  <div class="navigation-bar">
    <div
      v-if="assistiveTitle"
      class="navigation-bar__page-title-holder"
    >
      <div class="navigation-bar__page-assistive-title truncate-text">
        {{ assistiveTitle }}
      </div>
      <h1 class="navigation-bar__page-title truncate-text">
        {{ title }}
      </h1>
    </div>
    <h1
      v-else
      class="navigation-bar__page-title truncate-text"
    >
      {{ title }}
    </h1>

    <ui-tabs
      v-if="tabs.length"
      class="navigation-bar__tabs"
      :current-tab="currentTab"
      :tabs.prop="tabs"
      clean
    />
    <div
      v-else
      class="navigation-bar__tabs"
    >
      <slot />
    </div>

    <div class="actions-holder navigation-bar__actions">
      <div class="actions-slot">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script>
import tabs from '~widgets/tabs/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-tabs', tabs);

export default {
  props: {
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

    currentTab: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/styles/common.styl';

.navigation-bar {
  box-sizing: content-box;
  display: flex;
  align-items: center;
  flex: 0 0 auto;

  height: 64px;
  padding-left: 24px;
  padding-right: 24px;
  border-bottom: 1px solid border-color;
  background: #f5f5f5;

  &__page-title {
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    margin-top: 0;
    margin-bottom: 0;
  }

  &__page-assistive-title {
    color: #707070;
  }

  &__icon + &__page-title-holder,
  &__icon + &__page-title {
    margin-left: 32px;
  }

  &__tabs,
  &__content,
  &__actions {
    padding-left: 48px;
  }

  &__tabs,
  &__content {
    display: flex;
    align-self: stretch;
  }

  &__tabs {
    flex: 0 0 auto;
  }

  &__content {
    flex: 1 1 auto;
  }

  &__actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    flex: 0 0 auto;
  }
}

.page-title {
  display: flex;
  align-items: center;

  &__link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: black;
    cursor: pointer;
  }
}

.actions-holder {
  .actions-slot {
    display: flex;
    align-items: center;

    & > div {
      padding-left: 16px;
    }
  }

  &__button {
    margin: 0;
    min-width: 0;
  }
}

.actions-menu {
  &__divider {
    margin-top: 7px;
    margin-bottom: 8px;
  }
}

._mb_2 {
  margin-bottom: 2px;
}
</style>
