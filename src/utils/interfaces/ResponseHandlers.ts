export interface ResponseHandlers<T> {
  onSuccess: (data: T) => void;
  onError: (error: Error) => void;
}
