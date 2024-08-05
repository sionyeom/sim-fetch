// HTTP 메서드 타입 정의
type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// 요청 중인 URL과 AbortController를 매핑하는 타입
type RequestMap = {
  [key: string]: AbortController;
};

// 현재 진행 중인 요청을 저장하는 객체
const requests: RequestMap = {};

// HTTP 요청을 보내는 핵심 함수
export const coreFetch = async <T>(
  url: string, // 요청할 URL
  method: HTTPMethod, // HTTP 메서드 (GET, POST, PATCH, DELETE)
  body?: any, // 요청 본문 (POST, PATCH 요청 시 사용)
  customHeaders?: HeadersInit, // 사용자 정의 헤더
): Promise<T> => {
  // 이미 같은 URL에 대한 요청이 진행 중인 경우 에러를 발생시킴
  if (isRequestInProgress(url)) {
    throw new Error(`Request to ${url} is already in progress`);
  }

  // 새로운 AbortController를 생성하고 요청을 추적
  const controller = createController(url);

  // 사용자 정의 헤더와 기본 헤더를 결합하여 최종 헤더를 생성
  const headers = createHeaders(customHeaders);

  // 본문이 문자열이 아닌 경우 JSON 문자열로 변환
  const formattedBody =
    body && typeof body !== 'string' ? JSON.stringify(body) : body;

  // fetch에 사용할 옵션 설정
  const options: RequestInit = {
    method, // HTTP 메서드
    body: formattedBody, // 요청 본문
    headers, // 요청 헤더
    signal: controller.signal, // 요청 취소 신호
  };

  try {
    // HTTP 요청을 보내고 응답을 기다림
    const response = await fetch(url, options);

    // 응답 처리 함수 호출
    return await handleResponse<T>(url, response);
  } catch (error) {
    // 요청 처리 중 에러 발생 시 에러 처리
    handleError(url, error as Error);
    throw error;
  }
};

// HTTP 응답을 처리하는 함수
const handleResponse = async <T>(
  url: string, // 요청한 URL
  response: Response, // fetch API 응답 객체
): Promise<T> => {
  // 요청 추적에서 해당 URL 제거
  cleanupRequest(url);

  // 응답 상태가 OK가 아닌 경우 에러를 발생시킴
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // JSON 응답을 반환
  return response.json() as Promise<T>;
};

// 요청 처리 중 발생한 에러를 처리하는 함수
const handleError = (url: string, error: Error): void => {
  // 요청 추적에서 해당 URL 제거
  cleanupRequest(url);

  // AbortError (요청이 취소됨)인 경우 로그 출력
  if (error.name === 'AbortError') {
    console.log(`Request to ${url} was aborted`);
  } else {
    // 그 외의 에러는 콘솔에 에러 출력
    console.error(error);
  }
};

// 특정 URL에 대한 요청이 진행 중인지 확인하는 함수
const isRequestInProgress = (url: string): boolean => !!requests[url];

// 새로운 AbortController를 생성하고 요청 추적에 추가하는 함수
const createController = (url: string): AbortController => {
  const controller = new AbortController();
  requests[url] = controller;
  return controller;
};

// 요청 추적에서 특정 URL의 항목을 제거하는 함수
const cleanupRequest = (url: string): void => {
  delete requests[url];
};

// 기본 헤더와 사용자 정의 헤더를 결합하여 최종 헤더를 생성하는 함수
const createHeaders = (customHeaders?: HeadersInit): Headers => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(customHeaders || {}),
  });

  return headers;
};
