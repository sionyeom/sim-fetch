import { http, HttpResponse } from 'msw';

export interface Item {
  id: string;
  name: string;
  stock: number;
}

export const items: Item[] = [
  {
    id: '1',
    name: 'item1',
    stock: 1,
  },
];

export const handlers = [
  http.get('https://example.com/items', ({ request }) => {
    const url = new URL(request.url);

    let result = items;
    const id = url.searchParams.get('id');

    if (id) {
      result = id ? items.filter((item) => item.id === id) : items;
    }

    return HttpResponse.json(result);
  }),

  http.get<Pick<Item, 'id'>>('https://example.com/items/:id', ({ params }) => {
    const { id } = params;
    const item = items.find((item) => item.id === id);

    if (!item) return HttpResponse.json(null, { status: 404 });

    return HttpResponse.json(item);
  }),

  http.post<{}, Item>('https://example.com/item', async ({ request }) => {
    const { id, name, stock } = await request.json();

    return !id || !name || !stock
      ? HttpResponse.json(null, { status: 400 })
      : HttpResponse.json({ id, name, stock }, { status: 201 });
  }),

  http.patch<{}, Item>('https://example.com/item', async ({ request }) => {
    const { id, name, stock } = await request.json();

    if (!id) {
      return HttpResponse.json(null, { status: 400 });
    }

    if (!name || !stock) {
      return HttpResponse.json(null, { status: 400 });
    }

    if (!items.find((item) => item.id === id)) {
      return HttpResponse.json(null, { status: 404 });
    }

    return HttpResponse.json({ id, name, stock }, { status: 200 });
  }),

  http.delete<Pick<Item, 'id'>>(
    'https://example.com/item/:id',
    async ({ params }) => {
      const { id } = params;

      if (!id) {
        return HttpResponse.json(null, { status: 400 });
      }

      if (!items.find((item) => item.id === id)) {
        return HttpResponse.json(null, { status: 404 });
      }

      return HttpResponse.json({ id }, { status: 200 });
    },
  ),
];
