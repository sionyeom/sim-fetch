import { SimFetch } from '../core/simFetch';
import { SimFetchError } from '../interfaces/SimFetchError';
import { items, Item } from './mocks/handlers/handler';
import { server } from './mocks/setup';

describe('SimFetch', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  describe('setDefaultHeaders()', () => {
    it('should set default headers as given headers', () => {
      // given
      const headers = { Authorization: 'Bearer token' };
      // when
      SimFetch.setDefaultHeaders(headers);
      // then
      expect(SimFetch['defaultHeaders']).toEqual(headers);
    });
  });

  describe('removeDefaultHeader()', () => {
    it('should remove the header element for the given key', () => {
      // given
      const headers = {
        Authorization: 'Bearer token',
        Accept: 'application/json',
      };
      // when
      SimFetch.setDefaultHeaders(headers);
      SimFetch.removeDefaultHeader('Authorization');
      const expectedHeaders = { Accept: 'application/json' };
      // then
      expect(SimFetch['defaultHeaders']).toEqual(expectedHeaders);
    });
  });

  describe('get()', () => {
    it('should get', async () => {
      // when
      const response = await SimFetch.get<Item>('https://example.com/items');
      const { status, data } = response;
      expect(status).toBe(200);
      expect(data).toEqual(items);
    });

    it('should get with valid query params', async () => {
      // given
      const url = 'https://example.com/items';
      const params = { id: '1' };
      // when
      const response = await SimFetch.get<Item>(url, { params });
      const { status, data } = response;
      // then
      expect(status).toBe(200);
      expect(data).toEqual(items.filter((item) => item.id === '1'));
    });

    it('should get with valid params', async () => {
      // given
      const url = 'https://example.com/items/1';
      // when
      const response = await SimFetch.get<Item>(url);
      const { status, data } = response;
      const item = items.find((item) => item.id === '1');
      // then
      expect(status).toBe(200);
      expect(data).toEqual(item);
    });

    describe('should throw', () => {
      it('404 Not Found errors for missing or invalid query parameters.', async () => {
        try {
          // given
          const url = 'https://example.com/items';
          const params = { id: '2' };
          // when
          await SimFetch.get<Item>(url, { params });
        } catch (err) {
          if (err instanceof SimFetchError) {
            // then
            expect(err.status).toBe(404);
            expect(err.message).toBe('HTTP error! Status: 404');
          } else {
            fail('Expected a SimFetchError');
          }
        }
      });

      it('404 Not Found errors for missing or invalid params.', async () => {
        try {
          // given
          const url = 'https://example.com/items/2';
          // when
          await SimFetch.get<Item>(url);
        } catch (err) {
          if (err instanceof SimFetchError) {
            // then
            expect(err.status).toBe(404);
            expect(err.message).toBe('HTTP error! Status: 404');
          } else {
            fail('Expected a SimFetchError');
          }
        }
      });
    });
  });

  describe('post()', () => {
    it('should post with valid body', async () => {
      // given
      const item = {
        id: '2',
        name: 'item2',
        stock: 3,
      };
      // when
      const response = await SimFetch.post<Item>(
        `https://example.com/item`,
        item,
      );
      const { status, data } = response;
      // then
      expect(status).toBe(201);
      expect(data).toEqual(item);
    });
  });

  describe('patch()', () => {
    it('should patch with valid body', async () => {
      // given
      const item = {
        id: '1',
        name: 'item2',
        stock: 3,
      };
      // when
      const response = await SimFetch.patch<Item>(
        `https://example.com/item`,
        item,
      );
      const { status, data } = response;
      // then
      expect(status).toBe(200);
      expect(data).toEqual(item);
    });
  });

  describe('delete()', () => {
    it('should delete with valid params', async () => {
      // given
      const id = '1';
      // when
      const response = await SimFetch.delete<Item>(
        `https://example.com/item/${id}`,
      );
      const { status, data } = response;
      // then
      expect(status).toBe(200);
      expect(data).toEqual({ id });
    });
  });
});
