<template>
  <div class="table">
    <table :class="{ fixed: fixed }">
      <thead v-if="headers.length">
        <tr>
          <th
            v-for="header in headers"
            :key="header.name"
            :style="{ width: header.width }"
          >
            <div>{{ header.text }}</div>
            <div class="splitpane" />
          </th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    required: true,
    default: () => [],
  },
  fixed: {
    type: Boolean,
    default: false,
  }
})
</script>

<style lang="stylus" scoped>
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  max-width: 100%;

  &.fixed {
    table-layout: fixed;
  }

  thead {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    background-color: #f5f5f5;
  }

  th {
    position: relative;
    text-align: left;
    min-height: 32px;
    font-size: 12px;
    letter-spacing: 0.5px;
    color: #707070;
    text-transform: uppercase;
    font-weight: bold;
    padding-right: 12px;
    padding-left: 12px;
    height: 32px;
    line-height: 32px;
  }

  tbody {
    & ::slotted(tr) {
      border-bottom: 1px solid #e0e0e0;
      margin: 100px;
      padding: 100px;
      line-height: 50px;
    }
  }

  .splitpane {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 8px !important;
    padding-top: 4px;
    padding-bottom: 4px;

    &:after {
      content: "";
      display: block;
      width: 1px;
      height: 100%;
      margin-left: auto;
      margin-right: auto;
      border-radius: 2px;
      background-color: #e0e0e0;
    }
  }
}

</style>

