import { coreFetch } from './core'; // core 모듈 경로에 맞게 수정하세요

export class SimFetch {
  private static defaultHeaders: HeadersInit = {};

  // 기본 헤더를 설정하는 메서드
  static setDefaultHeaders(headers: HeadersInit): void {
    this.defaultHeaders = headers;
  }

  // 기본 헤더를 제거하는 메서드
  static removeDefaultHeader(key: string): void {
    if (this.defaultHeaders instanceof Headers) {
      this.defaultHeaders.delete(key);
    } else {
      const headers = { ...this.defaultHeaders } as Record<string, string>;
      delete headers[key];
      this.defaultHeaders = headers;
    }
  }

  // GET 요청 메서드
  static async get<T>(url: string, customHeaders?: HeadersInit): Promise<T> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'GET', undefined, headers);
  }

  // POST 요청 메서드
  static async post<T>(
    url: string,
    body: any,
    customHeaders?: HeadersInit,
  ): Promise<T> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'POST', body, headers);
  }

  // PATCH 요청 메서드
  static async patch<T>(
    url: string,
    body: any,
    customHeaders?: HeadersInit,
  ): Promise<T> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'PATCH', body, headers);
  }

  // DELETE 요청 메서드
  static async delete<T>(
    url: string,
    body?: any,
    customHeaders?: HeadersInit,
  ): Promise<T> {
    const headers = this.mergeHeaders(customHeaders);
    return await coreFetch<T>(url, 'DELETE', body, headers);
  }

  // 헤더 병합
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
