import { Proxy } from "modules/proxy/main.ts";

export const getIconRequest = {
  method: "GET",
  pathname: "/icon",
  fn: async (request: Request): Promise<Response> => {
    try {
      return new Response(await Proxy.icon.getIcon());
    } catch (e) {}
    return Response.error();
  },
};
