export const getIpFromRequest = (request: Request): string =>
  request.headers.get("X-Forwarded-For") ??
  request.headers.get("remote-address");

export const getIpFromUrl = async (url: string): Promise<string> => {
  const { hostname } = new URL(url);
  return (await Deno.resolveDns(hostname, "A"))[0];
};
