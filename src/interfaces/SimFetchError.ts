export class SimFetchError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'SimFetchError';
  }
}
