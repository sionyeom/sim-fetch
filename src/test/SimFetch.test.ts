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

  it('should set default headers correctly', () => {
    // given
    const headers = { Authorization: 'Bearer token' };
    // when
    SimFetch.setDefaultHeaders(headers);
    // then
    expect(SimFetch['defaultHeaders']).toEqual(headers);
  });

  it('should remove default header correctly', () => {
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

  describe('should handle GET requests', () => {
    it('should get', async () => {
      // when
      const response = await SimFetch.get<Item>('https://example.com/items');
      const { status, data } = response;
      expect(status).toBe(200);
      expect(data).toEqual(items);
    });

    it('should get with query params', async () => {
      // when
      const response = await SimFetch.get<Item>('https://example.com/items', {
        params: { id: '1' },
      });
      const { status, data } = response;
      // then
      expect(status).toBe(200);
      expect(data).toEqual(items.filter((item) => item.id === '1'));
    });

    it('should get with params', async () => {
      // when
      const response = await SimFetch.get<Item>('https://example.com/items/1');
      const { status, data } = response;
      const item = items.find((item) => item.id === '1');
      // then
      expect(status).toBe(200);
      expect(data).toEqual(item);
    });

    describe('should throw error with the correct response data and status code', () => {
      it('should handle 404 Not Found errors correctly with query params', async () => {
        try {
          // when
          await SimFetch.get<Item>('https://example.com/items', {
            params: { id: '2' },
          });
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

      it('should handle 404 Not Found errors correctly with params', async () => {
        try {
          // when
          await SimFetch.get<Item>('https://example.com/items/2');
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

  describe('should handle POST requests', () => {
    it('should post', async () => {
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

  describe('should handle PATCH requests', () => {
    it('should patch', async () => {
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

  describe('should handle DELETE requests', () => {
    it('should delete', async () => {
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
