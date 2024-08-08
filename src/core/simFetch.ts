import { coreFetch } from './core';

/**
 * @desc SimFetch 클래스
 * HTTP 요청을 쉽게 만들기 위한 유틸리티 클래스
 */
export class SimFetch {
  /** @type {HeadersInit} 기본 헤더 */
  private static defaultHeaders: HeadersInit = {};

  /**
   * 기본 헤더를 설정하는 메서드
   * @param {HeadersInit} headers 설정할 헤더
   */
  static setDefaultHeaders(headers: HeadersInit): void {
    this.defaultHeaders = headers;
  }

  /**
   * @desc 기본 헤더를 제거하는 메서드
   * @param {string} key 제거할 헤더의 키
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
   * @desc GET 요청 메서드
   * @template T
   * @param {string} url 요청할 URL
   * @param {object} [options] 쿼리 파라미터와 사용자 정의 헤더를 포함하는 옵션 객체
   * @param {Record<string, string>} [options.params] 쿼리 파라미터 객체
   * @param {HeadersInit} [options.customHeaders] 사용자 정의 헤더
   * @returns {Promise<{ data: T; status: number }>} 응답 데이터와 상태 코드
   */
  static async get<T>(
    url: string,
    options?: {
      params?: Record<string, string>; // 쿼리 파라미터 객체
      customHeaders?: HeadersInit; // 사용자 정의 헤더
    },
  ): Promise<{ data: T; status: number }> {
    // 쿼리 파라미터와 사용자 정의 헤더를 options 객체에서 추출
    const { params, customHeaders } = options || {};
    // 헤더 병합
    const headers = this.mergeHeaders(customHeaders);
    // URL에 쿼리 파라미터 추가
    const urlWithParams = this.buildUrlWithParams(url, params);
    // coreFetch 호출
    return await coreFetch<T>(urlWithParams, 'GET', undefined, headers);
  }

  /**
   * @desc POST 요청 메서드
   * @template T
   * @param {string} url 요청할 URL
   * @param {any} body 요청 본문
   * @param {HeadersInit} [customHeaders] 사용자 정의 헤더
   * @returns {Promise<{ data: T; status: number }>} 응답 데이터와 상태 코드
   */
  static async post<T>(
    url: string,
    body: any,
    customHeaders?: HeadersInit,
  ): Promise<{ data: T; status: number }> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'POST', body, headers);
  }

  /**
   * @desc PATCH 요청 메서드
   * @template T
   * @param {string} url 요청할 URL
   * @param {any} body 요청 본문
   * @param {HeadersInit} [customHeaders] 사용자 정의 헤더
   * @returns {Promise<{ data: T; status: number }>} 응답 데이터와 상태 코드
   */
  static async patch<T>(
    url: string,
    body: any,
    customHeaders?: HeadersInit,
  ): Promise<{ data: T; status: number }> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'PATCH', body, headers);
  }

  /**
   * @desc DELETE 요청 메서드
   * @template T
   * @param {string} url 요청할 URL
   * @param {any} [body] 요청 본문
   * @param {HeadersInit} [customHeaders] 사용자 정의 헤더
   * @returns {Promise<{ data: T; status: number }>} 응답 데이터와 상태 코드
   */
  static async delete<T>(
    url: string,
    body?: any,
    customHeaders?: HeadersInit,
  ): Promise<{ data: T; status: number }> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'DELETE', body, headers);
  }

  /**
   * @desc 헤더 병합 메서드
   * @param {HeadersInit} [customHeaders] 사용자 정의 헤더
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
   * @desc URL에 쿼리 파라미터를 추가하는 메서드
   * @param {string} url 기본 URL
   * @param {Record<string, string>} [params] 쿼리 파라미터 객체
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
