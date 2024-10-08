import { SimFetchError } from '../interfaces/SimFetchError';

/**
 * HTTP 메서드 타입 정의
 * @typedef {'GET' | 'POST' | 'PATCH' | 'DELETE'} HTTPMethod
 */
type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/**
 * 요청 중인 URL과 AbortController를 매핑하는 타입
 * @typedef {Object.<string, AbortController>} RequestMap
 */
type RequestMap = {
  [key: string]: AbortController;
};

/** 현재 진행 중인 요청을 저장하는 객체 */
const requests: RequestMap = {};

/**
 * HTTP 요청을 보내는 핵심 함수
 * @template T
 * @param url 요청할 URL
 * @param method HTTP 메서드 (GET, POST, PATCH, DELETE)
 * @param body 요청 본문 (POST, PATCH 요청 시 사용)
 * @param customHeaders 사용자 정의 헤더
 * @param useAbortController 해당 요청에 대해 AbortController를 사용할지 여부 (기본값: true)
 * @returns { data: T; status: number } 응답 데이터와 상태 코드
 * @throws {Error} 요청 중복 시 에러 발생
 */
export const coreFetch = async <T>(
  url: string,
  method: HTTPMethod,
  body?: any,
  customHeaders?: HeadersInit,
  useAbortController: boolean = true, // 기본값 true
): Promise<{ data: T; status: number }> => {
  if (isRequestInProgress(url) && useAbortController) {
    throw new Error(`Request to ${url} is already in progress`);
  }

  const controller = useAbortController ? createController(url) : undefined;
  const headers = createHeaders(customHeaders);
  const formattedBody =
    body && typeof body !== 'string' ? JSON.stringify(body) : body;

  const options: RequestInit = {
    method,
    body: formattedBody,
    headers,
    signal: controller?.signal,
  };

  try {
    const response = await fetch(url, options);
    return await handleResponse<T>(url, response, useAbortController);
  } catch (error) {
    handleError(url, error as Error, useAbortController);
    throw error as SimFetchError;
  }
};

/**
 * HTTP 응답을 처리하는 함수
 * @template T
 * @param url 요청한 URL
 * @param response fetch API 응답 객체
 * @param useAbortController 해당 요청에 대해 AbortController를 사용할지 여부
 * @returns { data, status } 응답 데이터와 상태 코드
 * @throws {Error} 응답 상태가 OK가 아닌 경우 에러 발생
 */
const handleResponse = async <T>(
  url: string,
  response: Response,
  useAbortController: boolean,
): Promise<{ data: T; status: number }> => {
  if (useAbortController) {
    cleanupRequest(url);
  }

  const status = response.status;

  if (!response.ok) {
    throw new SimFetchError(status, `HTTP error! Status: ${status}`);
  }

  const data = (await response.json()) as T;

  return { data, status };
};

/**
 *요청 처리 중 발생한 에러를 처리하는 함수
 * @param url 요청한 URL
 * @param error 발생한 에러
 * @param useAbortController 해당 요청에 대해 AbortController를 사용할지 여부
 */
const handleError = (
  url: string,
  error: Error,
  useAbortController: boolean,
): void => {
  if (useAbortController) {
    cleanupRequest(url);
  }

  if (error.name === 'AbortError') {
    console.log(`Request to ${url} was aborted`);
  } else {
    console.error(error.message);
  }
};

/**
 * 특정 URL에 대한 요청이 진행 중인지 확인하는 함수
 * @param url 요청할 URL
 * @returns {boolean} 요청 진행 여부
 */
const isRequestInProgress = (url: string): boolean => !!requests[url];

/**
 * 새로운 AbortController를 생성하고 요청 추적에 추가하는 함수
 * @param url 요청할 URL
 * @returns {AbortController} 생성된 AbortController
 */
const createController = (url: string): AbortController => {
  const controller = new AbortController();
  requests[url] = controller;
  return controller;
};

/**
 * 요청 추적에서 특정 URL의 항목을 제거하는 함수
 * @param url 요청할 URL
 */
const cleanupRequest = (url: string): void => {
  delete requests[url];
};

/**
 * 기본 헤더와 사용자 정의 헤더를 결합하여 최종 헤더를 생성하는 함수
 * @param customHeaders 사용자 정의 헤더
 * @returns {Headers} 결합된 헤더
 */
const createHeaders = (customHeaders?: HeadersInit): Headers => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(customHeaders || {}),
  });

  return headers;
};
