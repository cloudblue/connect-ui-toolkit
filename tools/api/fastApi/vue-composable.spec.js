import { useFastApiTableAdapter } from './vue-composable';
import { fastApiTableAdapter } from './adapter';


jest.mock('./adapter', () => ({
  fastApiTableAdapter: jest.fn().mockImplementation(() => {
    const result = {
      total: 42,
      items: ['foo', 'bar', 'baz'],
      page: 1,
    };

    return {
      items: [],
      total: 0,
      page: 1,
      load: jest.fn().mockResolvedValue(result),
      next: jest.fn().mockResolvedValue(result),
      previous: jest.fn().mockResolvedValue(result),
      filter: jest.fn().mockResolvedValue(result),
      setRowsPerPage: jest.fn().mockResolvedValue(result),
    };
  }),
}));

describe('#useFastApiTableAdapter', () => {
  let composable;
  let adapter;

  describe('#constructor', () => {
    beforeEach(() => {
      composable = useFastApiTableAdapter('/foo');
    });

    it('creates a new fastApiTableAdapter', () => {
      expect(fastApiTableAdapter).toHaveBeenCalledWith('/foo', 10);
    });

    it('returns the exposed properties', () => {
      expect(composable.items.value).toEqual([]);
      expect(composable.page.value).toEqual(1);
      expect(composable.loading.value).toEqual(false);
      expect(composable.total.value).toEqual(0);
      expect(composable.load).toBeInstanceOf(Function);
      expect(composable.next).toBeInstanceOf(Function);
      expect(composable.previous).toBeInstanceOf(Function);
      expect(composable.filter).toBeInstanceOf(Function);
      expect(composable.setRowsPerPage).toBeInstanceOf(Function);
      expect(composable._adapter).toBeDefined();
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      composable = useFastApiTableAdapter('/foo', 10);
      adapter = composable._adapter;
    });

    describe('#load', () => {
      it('handles loading state', async () => {
        const promise = composable.load();

        expect(composable.loading.value).toEqual(true);

        // wait for promise resolution
        await promise;

        expect(composable.loading.value).toEqual(false);
      });

      it('calls the adapter\'s load method', async () => {
        await composable.load();

        expect(adapter.load).toHaveBeenCalled();
      });

      it('updates the composable state after the call', async () => {
        await composable.load();

        expect(composable.items.value).toEqual(['foo', 'bar', 'baz']);
        expect(composable.total.value).toEqual(42);
        expect(composable.page.value).toEqual(1);
      });

      it('throws an error if the request is not successful', async () => {
        adapter.load.mockRejectedValueOnce(new Error('foo'));

        let error;

        try {
          await composable.load();
        } catch (e) {
          error = e;
        }

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('foo');
      });
    });

    describe('#next', () => {
      it('handles loading state', async () => {
        const promise = composable.next();

        expect(composable.loading.value).toEqual(true);

        // wait for promise resolution
        await promise;

        expect(composable.loading.value).toEqual(false);
      });

      it('calls the adapter\'s next method', async () => {
        await composable.next();

        expect(adapter.next).toHaveBeenCalled();
      });

      it('updates the composable state after the call', async () => {
        await composable.next();

        expect(composable.items.value).toEqual(['foo', 'bar', 'baz']);
        expect(composable.total.value).toEqual(42);
        expect(composable.page.value).toEqual(1);
      });

      it('throws an error if the request is not successful', async () => {
        adapter.next.mockRejectedValueOnce(new Error('foo'));

        let error;

        try {
          await composable.next();
        } catch (e) {
          error = e;
        }

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('foo');
      });
    });

    describe('#previous', () => {
      it('handles loading state', async () => {
        const promise = composable.previous();

        expect(composable.loading.value).toEqual(true);

        // wait for promise resolution
        await promise;

        expect(composable.loading.value).toEqual(false);
      });

      it('calls the adapter\'s previous method', async () => {
        await composable.previous();

        expect(adapter.previous).toHaveBeenCalled();
      });

      it('updates the composable state after the call', async () => {
        await composable.previous();

        expect(composable.items.value).toEqual(['foo', 'bar', 'baz']);
        expect(composable.total.value).toEqual(42);
        expect(composable.page.value).toEqual(1);
      });

      it('throws an error if the request is not successful', async () => {
        adapter.previous.mockRejectedValueOnce(new Error('foo'));

        let error;

        try {
          await composable.previous();
        } catch (e) {
          error = e;
        }

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('foo');
      });
    });

    describe('#filter', () => {
      it('handles loading state', async () => {
        const promise = composable.filter({ foo: 'bar' });

        expect(composable.loading.value).toEqual(true);

        // wait for promise resolution
        await promise;

        expect(composable.loading.value).toEqual(false);
      });

      it('calls the adapter\'s filter method', async () => {
        await composable.filter({ foo: 'bar' });

        expect(adapter.filter).toHaveBeenCalledWith({ foo: 'bar' });
      });

      it('updates the composable state after the call', async () => {
        await composable.filter({ foo: 'bar' });

        expect(composable.items.value).toEqual(['foo', 'bar', 'baz']);
        expect(composable.total.value).toEqual(42);
        expect(composable.page.value).toEqual(1);
      });

      it('throws an error if the request is not successful', async () => {
        adapter.filter.mockRejectedValueOnce(new Error('foo'));

        let error;

        try {
          await composable.filter({ foo: 'bar' });
        } catch (e) {
          error = e;
        }

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('foo');
      });
    });

    describe('#setRowsPerPage', () => {
      it('handles loading state', async () => {
        const promise = composable.setRowsPerPage(5);

        expect(composable.loading.value).toEqual(true);

        // wait for promise resolution
        await promise;

        expect(composable.loading.value).toEqual(false);
      });

      it('calls the adapter\'s setRowsPerPage method', async () => {
        await composable.setRowsPerPage(5);

        expect(adapter.setRowsPerPage).toHaveBeenCalled();
      });

      it('updates the composable state after the call', async () => {
        await composable.setRowsPerPage(5);

        expect(composable.items.value).toEqual(['foo', 'bar', 'baz']);
        expect(composable.total.value).toEqual(42);
        expect(composable.page.value).toEqual(1);
      });

      it('throws an error if the request is not successful', async () => {
        adapter.setRowsPerPage.mockRejectedValueOnce(new Error('foo'));

        let error;

        try {
          await composable.setRowsPerPage(5);
        } catch (e) {
          error = e;
        }

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('foo');
      });
    });
  });
});
