# SimFetch

SimFetch는 TypeScript에서 HTTP 요청을 간편하게 수행하기 위한 유틸리티 클래스입니다. 이 클래스는 GET, POST, PATCH, DELETE와 같은 일반적인 HTTP 메서드를 지원하며, 성공 및 오류 콜백을 통해 응답 처리를 관리합니다.

## 기능

- GET, POST, PATCH, DELETE HTTP 메서드를 지원합니다.
- JSON 요청 및 응답 본문을 처리합니다.
- 성공 및 오류 콜백을 통해 응답 처리를 일관되게 관리합니다.

## 설치

SimFetch를 설치하려면, 다음과 같은 명령을 사용하세요:

```sh
npm install
```

## 사용법

### SimFetch 클래스

SimFetch 클래스는 정적 메서드로 구성되어 있으며, 각 메서드는 URL과 핸들러를 인수로 받아 HTTP 요청을 수행합니다.

### GET 요청

```tsx
SimFetch.get<T>('https://api.example.com/data', {
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});

```

### POST 요청

```tsx
SimFetch.post<T>('https://api.example.com/data', { key: 'value' }, {
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});

```

### PATCH 요청

```tsx
SimFetch.patch<T>('https://api.example.com/data/1', { key: 'newValue' }, {
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});

```

### DELETE 요청

```tsx
SimFetch.delete<T>('https://api.example.com/data/1', {
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});

```
