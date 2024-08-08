import { SimFetch } from '../core/simFetch';
import SimFetchError from '../interfaces/SimFetchError';
import { items, Item } from './mocks/handlers/handler';
import { server } from './mocks/setup';

describe('SimFetch', () => {
  beforeEach(() => {
    // 모든 테스트 전 상태 초기화
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should set default headers correctly', () => {
    const headers = { Authorization: 'Bearer token' };
    SimFetch.setDefaultHeaders(headers);
    expect(SimFetch['defaultHeaders']).toEqual(headers);
  });

  it('should remove default header correctly', () => {
    const headers = {
      Authorization: 'Bearer token',
      Accept: 'application/json',
    };
    SimFetch.setDefaultHeaders(headers);
    SimFetch.removeDefaultHeader('Authorization');
    const expectedHeaders = { Accept: 'application/json' };
    expect(SimFetch['defaultHeaders']).toEqual(expectedHeaders);
  });

  describe('should handle GET requests', () => {
    it('should get', async () => {
      const response = await SimFetch.get<Item>('https://example.com/items');
      const { status, data } = response;
      expect(status).toBe(200);
      expect(data).toEqual(items);
    });

    it('should get with query params', async () => {
      const response = await SimFetch.get<Item>('https://example.com/items', {
        params: { id: '1' },
      });
      const { status, data } = response;
      expect(status).toBe(200);
      expect(data).toEqual(items.filter((item) => item.id === '1'));
    });

    it('should get with params', async () => {
      const response = await SimFetch.get<Item>('https://example.com/items/1');
      const { status, data } = response;
      const item = items.find((item) => item.id === '1');
      expect(status).toBe(200);
      expect(data).toEqual(item);
    });

    describe('should throw error with the correct response data and status code', () => {
      it('should handle 404 Not Found errors correctly with query params', async () => {
        try {
          await SimFetch.get<Item>('https://example.com/items', {
            params: { id: '2' },
          });
        } catch (err) {
          if (err instanceof SimFetchError) {
            expect(err.status).toBe(404);
            expect(err.message).toBe('HTTP error! Status: 404');
          } else {
            fail('Expected a SimFetchError');
          }
        }
      });

      it('should handle 404 Not Found errors correctly with params', async () => {
        try {
          await SimFetch.get<Item>('https://example.com/items/2');
        } catch (err) {
          if (err instanceof SimFetchError) {
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
      const item = {
        id: '2',
        name: 'item2',
        stock: 3,
      };
      const response = await SimFetch.post<Item>(
        `https://example.com/item`,
        item,
      );
      const { status, data } = response;
      expect(status).toBe(201);
      expect(data).toEqual(item);
    });
  });

  describe('should handle PATCH requests', () => {
    it('should patch', async () => {
      const item = {
        id: '1',
        name: 'item2',
        stock: 3,
      };
      const response = await SimFetch.patch<Item>(
        `https://example.com/item`,
        item,
      );
      const { status, data } = response;
      expect(status).toBe(200);
      expect(data).toEqual(item);
    });
  });

  describe('should handle DELETE requests', () => {
    it('should delete', async () => {
      const id = '1';
      const response = await SimFetch.delete<Item>(
        `https://example.com/item/${id}`,
      );
      const { status, data } = response;

      expect(status).toBe(200);
      expect(data).toEqual({ id });
    });
  });
});
