import { fastApiTableAdapter } from './adapter';


describe('#fastApiTableAdapter', () => {
  let result;
  let fetchResponse = {};

  Object.defineProperty(global, 'fetch', {
    value: jest.fn().mockImplementation(() => new Promise((resolve) => {
      resolve({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        ok: fetchResponse.ok,
        json: jest.fn().mockResolvedValue(fetchResponse.items),
        headers: {
          get: () => {
            if (fetchResponse.contentRangeTotal) {
              return `items 0-10/${fetchResponse.contentRangeTotal}`;
            }

            return '';
          },
        },
      });
    })),
  });

  beforeEach(() => {
    fetchResponse = {
      status: 200,
      statusText: 'Ok',
      ok: true,
      items: [],
      contentRangeTotal: 0,
    };
  });

  describe('#constructor', () => {
    it('returns the exposed properties', () => {
      result = fastApiTableAdapter('/foo');

      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        load: expect.any(Function),
        next: expect.any(Function),
        previous: expect.any(Function),
        filter: expect.any(Function),
        setRowsPerPage: expect.any(Function),
      });
    });
  });

  describe('methods', () => {
    let adapter;

    beforeEach(() => {
      adapter = fastApiTableAdapter('/foo');
    });

    describe('#load', () => {
      it('calls the adapter\'s endpoint with the correct parameters', async () => {
        await adapter.load();

        expect(fetch).toHaveBeenCalledWith('/foo?limit=10&offset=0');
      });

      it('returns the correct state object after the call', async () => {
        fetchResponse.contentRangeTotal = 2;
        fetchResponse.items = ['foo', 'bar'];

        const result = await adapter.load();

        expect(result).toEqual({
          page: 1,
          items: ['foo', 'bar'],
          total: 2,
        });
      });

      it('returns -1 as total if there is  no content range header', async () => {
        fetchResponse.contentRangeTotal = null;
        fetchResponse.items = ['foo', 'bar'];

        const result = await adapter.load();

        expect(result).toEqual({
          page: 1,
          items: ['foo', 'bar'],
          total: -1,
        });
      });

      it('throws an error if the request is not successful', async () => {
        fetchResponse.ok = false;
        fetchResponse.status = 500;
        fetchResponse.statusText = 'Internal Server Error';

        let error;

        try {
          await adapter.load();
        } catch (e) {
          error = e;
        }

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Failed to fetch "/foo?limit=10&offset=0". Received status "500: Internal Server Error"');
      });
    });

    describe('#next', () => {
      beforeEach(async () => {
        fetchResponse.contentRangeTotal = 1;
        fetchResponse.items = ['foo'];

        result = await adapter.next();
      });

      it('increases the current page and performs a request', () => {
        expect(fetch).toHaveBeenCalledWith('/foo?limit=10&offset=10');
      });

      it('returns the result of calling load', () => {
        expect(result).toEqual({
          page: 2,
          total: 1,
          items: ['foo'],
        });
      });
    });

    describe('#previous', () => {
      beforeEach(async () => {
        fetchResponse.contentRangeTotal = 1;
        fetchResponse.items = ['bar'];

        // Increase page to 3
        await adapter.next();
        await adapter.next();

        result = await adapter.previous();
      });

      it('decreases the current page and performs a request', () => {
        expect(fetch).toHaveBeenCalledWith('/foo?limit=10&offset=20');
      });

      it('returns the result of calling load', () => {
        expect(result).toEqual({
          page: 2,
          total: 1,
          items: ['bar'],
        });
      });
    });

    describe('#filter', () => {
      beforeEach(async () => {
        fetchResponse.contentRangeTotal = 1;
        fetchResponse.items = ['baz'];

        // Increase page to 2
        await adapter.next();

        result = await adapter.filter({ id: '123' });
      });

      it('resets the current page and performs a request with the new filters', () => {
        expect(fetch).toHaveBeenCalledWith('/foo?limit=10&offset=0&id=123');
      });

      it('returns the result of calling load', () => {
        expect(result).toEqual({
          page: 1,
          total: 1,
          items: ['baz'],
        });
      });
    });

    describe('#setRowsPerPage', () => {
      beforeEach(async () => {
        fetchResponse.contentRangeTotal = 1;
        fetchResponse.items = ['qux'];

        // Increase page to 2
        await adapter.next();

        result = await adapter.setRowsPerPage(20);
      });

      it('resets the current page and performs a request with the new limit', () => {
        expect(fetch).toHaveBeenCalledWith('/foo?limit=20&offset=0');
      });

      it('returns the result of calling load', () => {
        expect(result).toEqual({
          page: 1,
          total: 1,
          items: ['qux'],
        });
      });
    });
  });
});
