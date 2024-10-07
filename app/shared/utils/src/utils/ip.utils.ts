import { getURL } from "./urls.utils.ts";

export const getIpFromRequest = (request: Request): string | null =>
  request.headers.get("X-Forwarded-For") ??
  request.headers.get("remote-address");

export const getIpFromUrl = async (url: string): Promise<string> => {
  const { hostname } = getURL(url);
  return (await Deno.resolveDns(hostname, "A"))[0];
};
