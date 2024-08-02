interface ResponseHandlers<T> {
  onSuccess: (data: T) => void;
  onError: (error: Error) => void;
}

export class SimpleFetch {
  static async get<T>(
    url: string,
    handlers: ResponseHandlers<T>,
  ): Promise<void> {
    try {
      const response = await fetch(url);
      this.handleResponse<T>(response, handlers);
    } catch (error) {
      handlers.onError(error as Error);
    }
  }

  static async post<T>(
    url: string,
    body: any,
    handlers: ResponseHandlers<T>,
  ): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      this.handleResponse<T>(response, handlers);
    } catch (error) {
      handlers.onError(error as Error);
    }
  }

  static async patch<T>(
    url: string,
    body: any,
    handlers: ResponseHandlers<T>,
  ): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      this.handleResponse<T>(response, handlers);
    } catch (error) {
      handlers.onError(error as Error);
    }
  }

  static async delete<T>(
    url: string,
    handlers: ResponseHandlers<T>,
  ): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.handleResponse<T>(response, handlers);
    } catch (error) {
      handlers.onError(error as Error);
    }
  }

  private static async handleResponse<T>(
    response: Response,
    handlers: ResponseHandlers<T>,
  ): Promise<void> {
    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as T;
      handlers.onSuccess(data);
    } catch (error) {
      handlers.onError(error as Error);
    }
  }
}
