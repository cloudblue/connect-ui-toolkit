<template>
  <ui-table
    :headers="props.headers"
    :fixed="fixed"
  >
    <slot />
  </ui-table>
  <div class="buttons-container">
    <ui-button
      :disabled="previousButtonDisabled"
      class="previous-button"
      background-color="#fff"
      color="#161616"
      height="26px"
      width="80px"
      @clicked="previousClicked"
    >
      <div class="btn-text">
        Previous
      </div>
    </ui-button>
    <div>{{ currentPage }} / {{ totalPages }}</div>
    <ui-button
      :disabled="nextButtonDisabled"
      class="next-button"
      background-color="#fff"
      color="#161616"
      height="26px"
      width="56px"
      @clicked="nextClicked"
    >
      <div class="btn-text">
        Next
      </div>
    </ui-button>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import table from '~widgets/table/widget.vue';
import button from '~widgets/button/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-table', table);
registerWidget('ui-button', button);

const emit = defineEmits(['previousClicked', 'nextClicked', 'itemsLoaded']);
const ITEMS_PER_PAGE = 10;
const props = defineProps({
  headers: {
    type: Array,
    required: true,
    default: () => [],
  },
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 1,
  },
  fixed: {
    type: Boolean,
    default: false,
  },
});

const totalPages = computed(() => Math.ceil(props.totalItems / ITEMS_PER_PAGE))
const previousButtonDisabled = computed(() => props.currentPage === 1)
const nextButtonDisabled = computed(() => props.currentPage === totalPages.value)

const previousClicked = () => emit('previousClicked');

const nextClicked = () => emit('nextClicked');

const prepareItems = (items) => {
  return items.slice(0, ITEMS_PER_PAGE)
}

watch(() => props.items, function(newItems) {
  emit('itemsLoaded',  prepareItems(newItems));
}, { deep: true, immediate: true });
</script>

<style lang="stylus" scoped>
.buttons-container {
  display: flex;
  align-items: center;
  height: 48px;

  .previous-button {
    margin-right: 16px;
    border: 1px solid #e0e0e0;
  }

  .next-button {
    margin-left: 16px;
    border: 1px solid #e0e0e0;
  }

  .btn-text {
    text-transform: capitalize;
  }
}
</style>
