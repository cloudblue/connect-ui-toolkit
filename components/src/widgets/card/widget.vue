<template>
  <div class="c-card">
    <div class="c-card__header">
      <p
        v-if="title"
        class="c-card__title"
      >
        {{ title }}
      </p>
      <p
        v-if="subtitle"
        class="c-card__subtitle"
      >
        {{ subtitle }}
      </p>
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
  overflow: hidden;
  padding: 18px 24px 24px 24px;
  display: block;
  text-decoration: inherit;
  color: inherit;

  &__header{
    margin-bottom: 26px;
  }

  &__title {
    line-height: 25px;
    font-size: 20px;
    margin: 0;
  }

  &__subtitle {
    font-size: 14px;
    line-height: 20px;
    color: #707070;
    margin: 0;
  }

}
</style>
