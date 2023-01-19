<template lang="pug">
.c-card(:class="classes")
  .c-card__header
    p.c-card__title(v-if="title") {{ title }}
    p.c-card__subtitle(v-if="subtitle") {{ subtitle }}

  .c-card__content
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