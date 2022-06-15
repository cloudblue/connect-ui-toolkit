<template lang="pug">
.tabs-container
  content
</template>

<script>
export default {
  inject: ['$listen', '$publish'],
  $publishes: ['open-pad'],

  created() {
    this.$listen('click-tab', ({ tab }) => this.$publish('open-pad', { pad: tab }));
  },
}
</script>

<style lang="stylus" scoped>
.tabs-container {
  width: 100%;
  margin-top: 32px;
}
</style>