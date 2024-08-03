export const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const createHeaders = (customHeaders: { [key: string]: string }) => ({
  ...defaultHeaders,
  ...customHeaders,
});
