import { getURL } from "./urls.utils.ts";

export const getIpFromRequest = (request: Request): string | null =>
  request.headers.get("X-Forwarded-For") ??
  request.headers.get("remote-address");

export const getIpFromUrl = async (url: string): Promise<string> => {
  const { hostname } = getURL(url);
  return (await Deno.resolveDns(hostname, "A"))[0];
};

export const compareIps = (ip: string, remoteIp: string): boolean =>
  //check if is local network
  remoteIp.startsWith("192.168.") ||
  //check if is local computer
  remoteIp.startsWith("172.") ||
  //check if is equal
  ip === remoteIp;
