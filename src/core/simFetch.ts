import { coreFetch } from './core';

/**
 * SimFetch 클래스
 * HTTP 요청을 쉽게 만들기 위한 유틸리티 클래스
 */
export class SimFetch {
  /** 기본 헤더 */
  private static defaultHeaders: HeadersInit = {};

  /** 기본 AbortController 사용 여부 */
  private static useAbortControllerDefault: boolean = true;

  /**
   * 기본 헤더를 설정하는 메서드
   * @param headers 설정할 헤더
   */
  static setDefaultHeaders(headers: HeadersInit): void {
    this.defaultHeaders = headers;
  }

  /**
   * 기본 헤더를 제거하는 메서드
   * @param key 제거할 헤더의 키
   */
  static removeDefaultHeader(key: string): void {
    if (this.defaultHeaders instanceof Headers) {
      this.defaultHeaders.delete(key);
    } else {
      const headers = { ...this.defaultHeaders } as Record<string, string>;
      delete headers[key];
      this.defaultHeaders = headers;
    }
  }

  /**
   * 기본 AbortController 사용 여부를 설정하는 메서드
   * @param useAbortController 기본값으로 사용할 AbortController 사용 여부
   */
  static setUseAbortControllerDefault(useAbortController: boolean): void {
    if (typeof useAbortController !== 'boolean') {
      throw new TypeError(
        `Invalid value type: ${typeof useAbortController}. Expected boolean.`,
      );
    }

    this.useAbortControllerDefault = useAbortController;
  }

  /**
   * GET 요청 메서드
   * @param url 요청할 URL
   * @param options 쿼리 파라미터와 사용자 정의 헤더를 포함하는 옵션 객체
   * @param options.params 쿼리 파라미터 객체
   * @param options.customHeaders 사용자 정의 헤더
   * @param options.useAbortController 해당 요청에 대해 AbortController를 사용할지 여부
   * @returns { data, status} 응답 데이터와 상태 코드
   */
  static async get<T>(
    url: string,
    options?: {
      params?: Record<string, string>; // 쿼리 파라미터 객체
      customHeaders?: HeadersInit; // 사용자 정의 헤더
      useAbortController?: boolean; // AbortController 사용 여부
    },
  ): Promise<{ data: T; status: number }> {
    const { params, customHeaders, useAbortController } = options || {};
    const headers = this.mergeHeaders(customHeaders);
    const urlWithParams = this.buildUrlWithParams(url, params);
    return await coreFetch<T>(
      urlWithParams,
      'GET',
      undefined,
      headers,
      useAbortController ?? this.useAbortControllerDefault,
    );
  }

  /**
   * POST 요청 메서드
   * @param url 요청할 URL
   * @param body 요청 본문
   * @param customHeaders 사용자 정의 헤더
   * @param useAbortController 해당 요청에 대해 AbortController를 사용할지 여부
   * @returns { data, status} 응답 데이터와 상태 코드
   */
  static async post<T>(
    url: string,
    body: any,
    customHeaders?: HeadersInit,
    useAbortController?: boolean,
  ): Promise<{ data: T; status: number }> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(
      url,
      'POST',
      body,
      headers,
      useAbortController ?? this.useAbortControllerDefault,
    );
  }

  /**
   * PATCH 요청 메서드
   * @param url 요청할 URL
   * @param body 요청 본문
   * @param customHeaders 사용자 정의 헤더
   * @param useAbortController 해당 요청에 대해 AbortController를 사용할지 여부
   * @returns { data, status } 응답 데이터와 상태 코드
   */
  static async patch<T>(
    url: string,
    body: any,
    customHeaders?: HeadersInit,
    useAbortController?: boolean,
  ): Promise<{ data: T; status: number }> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(
      url,
      'PATCH',
      body,
      headers,
      useAbortController ?? this.useAbortControllerDefault,
    );
  }

  /**
   * DELETE 요청 메서드
   * @param url 요청할 URL
   * @param body 요청 본문
   * @param customHeaders 사용자 정의 헤더
   * @param useAbortController 해당 요청에 대해 AbortController를 사용할지 여부
   * @returns { data, status } 응답 데이터와 상태 코드
   */
  static async delete<T>(
    url: string,
    body?: any,
    customHeaders?: HeadersInit,
    useAbortController?: boolean,
  ): Promise<{ data: T; status: number }> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(
      url,
      'DELETE',
      body,
      headers,
      useAbortController ?? this.useAbortControllerDefault,
    );
  }

  /**
   * 헤더 병합 메서드
   * @param customHeaders 사용자 정의 헤더
   * @returns {HeadersInit} 병합된 헤더
   */
  private static mergeHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers = { ...this.defaultHeaders } as Record<string, string>;

    if (customHeaders) {
      for (const [key, value] of Object.entries(customHeaders)) {
        if (value !== undefined) {
          headers[key] = value;
        }
      }
    }

    return headers;
  }

  /**
   * URL에 쿼리 파라미터를 추가하는 메서드
   * @param url 기본 URL
   * @param params 쿼리 파라미터 객체
   * @returns {string} 쿼리 파라미터가 포함된 URL
   */
  private static buildUrlWithParams(
    url: string,
    params?: Record<string, string>,
  ): string {
    if (!params) return url;

    const queryString = new URLSearchParams(params).toString();

    return `${url}?${queryString}`;
  }
}
