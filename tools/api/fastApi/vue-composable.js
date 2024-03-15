import { ref } from 'vue';

import { fastApiTableAdapter } from './adapter.js';

/**
 * Vue composable to wrap fastApiTableAdapter into reactive properties
 *
 * @param {string} endpoint API endpoint to fetch
 * @param {number} [rowsPerPage=10] Initial amount of rows per page
 *
 * @returns {{next: ((function(): Promise<void>)|*), filter: ((function(*): Promise<void>)|*), total: Ref<UnwrapRef<number>>, load: ((function(): Promise<void>)|*), previous: ((function(): Promise<void>)|*), setRowsPerPage: ((function(*): Promise<void>)|*), page: Ref<UnwrapRef<number>>, loading: Ref<UnwrapRef<boolean>>, items: Ref<UnwrapRef<[]>>}}
 */
export const useFastApiTableAdapter = (endpoint, rowsPerPage = 10) => {
  const adapter = fastApiTableAdapter(endpoint, rowsPerPage);

  const items = ref(adapter.items);
  const total = ref(adapter.total);
  const page = ref(adapter.page);
  const loading = ref(false);

  const updateState = (newState) => {
    items.value = newState.items;
    total.value = newState.total;
    page.value = newState.page;
  };

  const doAdapterAction = async (action, params) => {
    try {
      loading.value = true;
      const newState = await adapter[action](params);
      updateState(newState);
    } finally {
      loading.value = false;
    }
  };

  const load = () => doAdapterAction('load');
  const next = () => doAdapterAction('next');
  const previous = () => doAdapterAction('previous');
  const filter = (newFilters) => doAdapterAction('filter', newFilters);
  const setRowsPerPage = (newRowsPerPage) => doAdapterAction('setRowsPerPage', newRowsPerPage);

  return {
    load,
    next,
    previous,
    filter,
    setRowsPerPage,
    page,
    loading,
    items,
    total,
    _adapter: adapter,
  };
};
