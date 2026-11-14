import { CORS_HEADERS } from "../consts/cors.consts.ts";

export const getCORSHeaders = (): Headers => {
  const headers = new Headers();
  for (const [key, value] of CORS_HEADERS) headers.append(key, value);
  return headers;
};

export const appendCORSHeaders = (headers: Headers): void => {
  for (const [key, value] of CORS_HEADERS) headers.append(key, value);
};
