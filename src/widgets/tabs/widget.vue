<template lang="pug">
.tabs-container
  content
</template>

<script>
export default {
  inject: ['$boiler'],

  created() {
    this.$boiler.publishes('open-pad');
    this.$boiler.listen('click-tab', ({ tab }) => this.$boiler.publish('open-pad', { pad: tab }));
  },
}
</script>

<style lang="stylus" scoped>
.tabs-container {
  width: 100%;
  margin-top: 32px;
}
</style>