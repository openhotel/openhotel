export const getIpFromRequest = (request: Request): string =>
  request.headers.get("X-Forwarded-For");
