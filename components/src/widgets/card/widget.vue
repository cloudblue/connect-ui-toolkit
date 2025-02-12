<template>
  <div class="c-card">
    <div class="c-card__header">
      <div class="c-card__title-container">
        <div class="c-card__title">
          <slot name="title">
            <p v-if="title">{{ title }}</p>
          </slot>
        </div>
        <div class="c-card__subtitle">
          <slot name="subtitle">
            <p v-if="subtitle">{{ subtitle }}</p>
          </slot>
        </div>
      </div>
      <div class="c-card__actions">
        <slot name="actions" />
      </div>
    </div>

    <div class="c-card__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },

    subtitle: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/styles/common.styl';

.c-card {
  border: 1px solid border-color;
  border-radius: 8px;
  padding: 18px 24px 24px 24px;
  display: block;
  text-decoration: inherit;
  color: inherit;

  &__header {
    display: flex;
    margin-bottom: 24px;
    align-items: start;
    flex-grow: 1;
    justify-content: space-between;
  }

  &__title {
    line-height: 24px;
    font-size: 18px;
    font-weight: 500;
    margin: 0;

    p,
    & ::slotted(p) {
      margin: 0;
    }
  }

  &__subtitle {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #707070;
    white-space: pre-wrap;

    p,
    & ::slotted(p) {
      margin: 0;
    }
  }

  &__title-container {
    display: inline-block !important;
  }
}
</style>
