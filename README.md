# SimFetch

`SimFetch`는 TypeScript와 JavaScript에서 HTTP 요청을 쉽게 만들기 위한 유틸리티 클래스입니다. 커스텀 헤더와 요청 취소를 지원하는 GET, POST, PATCH, DELETE 요청을 위한 정적 메서드를 제공합니다.

## 기능

- **간단한 API**: 일반적인 HTTP 메서드를 위한 사용하기 쉬운 정적 메서드.
- **요청 취소**: `AbortController`를 사용하여 요청 취소를 자동으로 관리.
- **커스텀 헤더**: 각 요청에 대해 기본 및 커스텀 헤더를 지원.
- **TypeScript 지원**: 향상된 개발 경험을 위한 완전한 타입 지원.

## 설치

`SimFetch`를 npm을 통해 설치할 수 있습니다:

```bash
npm install sim-fetch
```

또는 yarn을 통해 설치할 수 있습니다:

```bash
yarn add sim-fetch
```
## 사용법

### 설정

프로젝트에 `SimFetch`를 임포트합니다:

```tsx
import { SimFetch } from 'sim-fetch';
```

### 기본 헤더 설정

모든 요청에 대한 기본 헤더를 설정할 수 있습니다:

```tsx
SimFetch.setDefaultHeaders({
  'Content-Type': 'application/json' // default
  'Authorization': 'Bearer your-token', 
});
```

### 기본 헤더 제거

기본 헤더를 제거하려면 `removeDefaultHeader` 메서드를 사용합니다:

```tsx
SimFetch.removeDefaultHeader('Authorization');
```

### 특정 헤더 추가

특정 헤더를 추가한 요청을 설정할 수 있습니다.

```tsx
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
    ...
  }
}
```

## 요청 만들기

### GET 요청 : URL 통한 요청
```tsx
interface ApiResponse {
  id: string;
  name: string;
  description?: string;
}

try {
  const response = await SimFetch.get<ApiResponse>('https://api.example.com');
  const { status, data } = response;

  if (status === 200) {
    return data;
  }
} catch (error) {
  if (error instanceof SimFetchError) {
    const { status, message } = error;
    ...
  }
}
```

### GET 요청 : Query Params 활용 요청
```tsx
interface ApiResponse {
  id: string;
  name: string;
  description?: string;
}

try {
  const response = await SimFetch.get<Item>('https://example.com/items', {
    params: { id: '1' },
  });
  const { status, data } = response;

  if (status === 200) {
    return data;
  }
} catch (error) {
  if (error instanceof SimFetchError) {
    const { status, message } = error;
    ...
  }
}
```

### GET 요청 : Params 활용 요청
```tsx
interface ApiResponse {
  id: string;
  name: string;
  description?: string;
}

try {
  const response = await SimFetch.get<ApiResponse>('https://api.example.com/1');
  const { status, data } = response;

  if (status === 200) {
    return data;
  }
} catch (error) {
  if (error instanceof SimFetchError) {
    const {status, message} = error
    ...
  }
}
```

### POST 요청

```tsx
interface ApiResponse {
  id: string;
  name: string;
  description?: string;
}

try {
  const requestBody = { id: '1', name: 'New Item', description: 'Item Description' };
  const response = await SimFetch.post<ApiResponse>(
    'https://api.example.com',
    requestBody,
  );

  const { status, data } = response;

  if (status === 201) {
    return data;
  }
} catch (error) {
  if (error instanceof SimFetchError) {
    const {status, message} = error
    ...
  }
}
```

### PATCH 요청

```tsx
try {
  const requestBody = { name: 'Updated Item' };
  const response = await SimFetch.patch(
    'https://api.example.com/1',
    requestBody,
  );

  const { status, data } = response;

  if (status === 200) {
    return data;
  }
} catch (error) {
  if (error instanceof SimFetchError) {
    const { status, message } = error;
    ...
  }
}
```

### DELETE 요청

```tsx
interface ApiResponse {
  id: string;
  name: string;
  description?: string;
}

try {
  const response = await SimFetch.delete<ApiResponse>(
    'https://api.example.com/1',
  );

  const { status, data } = response;

  if (status === 200) {
    return data;
  }
} catch (error) {
  if (error instanceof SimFetchError) {
    const { status, message } = error;
    ...
  }
}
```
