import { requestClient } from "./client.request.ts";

export const getPhantomRequest = {
  method: "GET",
  pathname: "/phantom",
  fn: async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    url.pathname = "";
    return await requestClient({ ...request, url: url.href });
  },
};
