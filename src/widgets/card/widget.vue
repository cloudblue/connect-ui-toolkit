<template lang="pug">
.card
  .card__header
    p.card__title(v-if="title") {{ title }}
    p.card__subtitle(v-if="subtitle") {{ subtitle }}

  .card__content
    slot
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: String,
  },
}
</script>

<style lang="stylus" scoped>
.card {
  border: 1px solid #e0e0e0;
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