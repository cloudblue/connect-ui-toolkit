const getTotalItemsFromContentRangeHeader = (value) =>
  parseInt(/\w+ \d+-\d+\/(\d+)/g.exec(value)[1]);

const fetchItems = async (endpoint, queryParams) => {
  const parameters = new URLSearchParams(queryParams);
  const fullUrl = `${endpoint}?${parameters.toString()}`;

  const response = await fetch(fullUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch "${fullUrl}". Received status "${response.status}: ${response.statusText}"`,
    );
  }

  const contentRange = response.headers.get('content-range');
  // Default to -1 if there is no content-range header
  const total = contentRange ? getTotalItemsFromContentRangeHeader(contentRange) : -1;

  const items = await response.json();

  return { total, items };
};

/**
 *
 * @param {string} endpoint API endpoint to fetch
 * @param {number} [rowsPerPage=10] Initial amount of items per page
 * @returns {{next: (function(): Promise<{total: number, page: number, items: *[]}>), filter: (function(Object<string, string|number>): Promise<{total: number, page: number, items: *[]}>), total: number, load: (function(): Promise<{total: number, page: number, items: *[]}>), previous: (function(): Promise<{total: number, page: number, items: *[]}>), setRowsPerPage: (function(number): Promise<{total: number, page: number, items: *[]}>), page: number, items: []}}
 */
export const fastApiTableAdapter = (endpoint, rowsPerPage = 10) => {
  const state = {
    items: [],
    total: 0,
    page: 1,
  };

  let limit = rowsPerPage;
  let filters = {};

  /**
   * @returns {Promise<{total: number, page: number, items: *[]}>}
   */
  const load = async () => {
    const response = await fetchItems(endpoint, {
      limit,
      offset: limit * (state.page - 1),
      ...filters,
    });

    state.total = response.total;
    state.items = response.items;

    return state;
  };

  /**
   * @returns {{total: number, page: number, items: *[]}|Promise<{total: number, page: number, items: *[]}>}
   */
  const next = () => {
    if (state.page >= Math.ceil(state.total / limit)) return state;

    state.page++;

    return load();
  };

  /**
   * @returns {{total: number, page: number, items: *[]}|Promise<{total: number, page: number, items: *[]}>}
   */
  const previous = () => {
    if (state.page <= 1) return state;

    state.page--;

    return load();
  };

  /**
   * @param {Object.<string,string|number>}newFilters
   * @returns {Promise<{total: number, page: number, items: *[]}>}
   */
  const filter = (newFilters) => {
    filters = newFilters;
    state.page = 1;

    return load();
  };

  /**
   * @param {number} newRowsPerPage
   * @returns {Promise<{total: number, page: number, items: *[]}>}
   */
  const setRowsPerPage = (newRowsPerPage) => {
    limit = newRowsPerPage;
    state.page = 1;

    return load();
  };

  return {
    load,
    next,
    previous,
    filter,
    setRowsPerPage,
    ...state,
  };
};
