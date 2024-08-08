import { SimFetch } from './core/simFetch'; // Adjust the path if necessary
import { ResponseHandlers } from './interfaces/ResponseHandlers';

export { SimFetch, ResponseHandlers };

try {
  // 커스텀 헤더를 포함한 GET 요청
  const customHeaders = {
    Authorization: 'Bearer your-token',
    'X-Custom-Header': 'custom-value',
  };

  const response = await SimFetch.get<any>(
    'https://api.sampleapis.com/wines/reds',
    customHeaders,
  );

  const { status, data } = response;

  if (status === 200) {
    return data;
  }
} catch (error) {
  if (error instanceof SimFetchError) {
    const { status, message } = error;
  }
}
