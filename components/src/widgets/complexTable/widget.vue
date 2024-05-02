<template>
  <ui-menu :closeOnClickInside="false">
    <ui-button
      slot="trigger"
      class="filter-trigger"
      :disabled="filterableHeaders.length === 0"
      icon="googleFilterListBaseline"
      label="filter"
      mode="flat"
      size="small"
    />

    <div
      slot="content"
      class="items-list"
    >
      <div
        v-for="header in filterableHeaders"
        :key="header.name"
        class="filter-item"
      >
        <span class="text">{{ header.text }}</span>
        <ui-textfield @input="(val) => filterInput(header.value, val)" />
      </div>
      <ui-button
        label="Filter"
        class="filter-btn"
        @clicked="applyFilters"
      />
    </div>
  </ui-menu>
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
      mode="outlined"
      label="Previous"
      size="small"
      lowerCase
      @clicked="previousClicked"
    />
    <div>{{ currentPage }} / {{ totalPages }}</div>
    <ui-button
      :disabled="nextButtonDisabled"
      class="next-button"
      mode="outlined"
      label="Next"
      size="small"
      lowerCase
      @clicked="nextClicked"
    />
  </div>
</template>

<script setup>
import { computed, watch, reactive } from 'vue';
import table from '~widgets/table/widget.vue';
import button from '~widgets/button/widget.vue';
import menu from '~widgets/menu/widget.vue';
import textfield from '~widgets/textfield/widget.vue';
import icon from '~widgets/icon/widget.vue';
import registerWidget from '~core/registerWidget';

registerWidget('ui-table', table);
registerWidget('ui-button', button);
registerWidget('ui-menu', menu);
registerWidget('ui-textfield', textfield);
registerWidget('ui-icon', icon);

const emit = defineEmits(['previousClicked', 'nextClicked', 'itemsLoaded', 'filtersApplied']);
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

const filtersApplied = reactive({});

const totalPages = computed(() => Math.ceil(props.totalItems / ITEMS_PER_PAGE));
const previousButtonDisabled = computed(() => props.currentPage === 1);
const nextButtonDisabled = computed(() => props.currentPage === totalPages.value);
const filterableHeaders = computed(() => props.headers.filter((header) => header.filterable));

const cleanFiltersApplied = computed(() =>
  Object.keys(filtersApplied).reduce((obj, k) => {
    if (filtersApplied[k] !== '') obj[k] = filtersApplied[k];
    return obj;
  }, {}),
);

const previousClicked = () => emit('previousClicked');
const nextClicked = () => emit('nextClicked');
const applyFilters = () => emit('filtersApplied', cleanFiltersApplied.value);

const filterInput = (field, e) => {
  filtersApplied[field] = e.detail[0];
};

const prepareItems = (items) => {
  return items.slice(0, ITEMS_PER_PAGE);
};

watch(
  () => props.items,
  function (newItems) {
    emit('itemsLoaded', prepareItems(newItems));
  },
  { deep: true, immediate: true },
);
</script>

<style lang="stylus" scoped>
.filter-trigger {
  display: block;
  margin-bottom: 8px;
}

.items-list {
  position: relative;
  width: 350px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 2px;
  padding: 8px;
  box-shadow: 0 4px 20px 0 #00000040;
  z-index: 1;

  .filter-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .text {
      width: 50%
    }
  }

  .filter-btn {
    margin-left: auto;
  }
}

.buttons-container {
  display: flex;
  align-items: center;
  height: 48px;
  font-size: 14px;

  .previous-button {
    margin-right: 16px;
  }

  .next-button {
    margin-left: 16px;
  }
}
</style>
