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
   * @param {HeadersInit} [customHeaders] 사용자 정의 헤더
   * @returns {Promise<T>} 응답 데이터
   */
  static async get<T>(url: string, customHeaders?: HeadersInit): Promise<T> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'GET', undefined, headers);
  }

  /**
   * @desc POST 요청 메서드
   * @template T
   * @param {string} url 요청할 URL
   * @param {any} body 요청 본문
   * @param {HeadersInit} [customHeaders] 사용자 정의 헤더
   * @returns {Promise<T>} 응답 데이터
   */
  static async post<T>(
    url: string,
    body: any,
    customHeaders?: HeadersInit,
  ): Promise<T> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'POST', body, headers);
  }

  /**
   * @desc PATCH 요청 메서드
   * @template T
   * @param {string} url 요청할 URL
   * @param {any} body 요청 본문
   * @param {HeadersInit} [customHeaders] 사용자 정의 헤더
   * @returns {Promise<T>} 응답 데이터
   */
  static async patch<T>(
    url: string,
    body: any,
    customHeaders?: HeadersInit,
  ): Promise<T> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'PATCH', body, headers);
  }

  /**
   * @desc DELETE 요청 메서드
   * @template T
   * @param {string} url 요청할 URL
   * @param {any} [body] 요청 본문
   * @param {HeadersInit} [customHeaders] 사용자 정의 헤더
   * @returns {Promise<T>} 응답 데이터
   */
  static async delete<T>(
    url: string,
    body?: any,
    customHeaders?: HeadersInit,
  ): Promise<T> {
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
}
