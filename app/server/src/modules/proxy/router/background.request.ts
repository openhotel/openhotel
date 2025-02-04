import { Proxy } from "modules/proxy/main.ts";

export const getBackgroundRequest = {
  method: "GET",
  pathname: "/background",
  fn: async (request: Request): Promise<Response> => {
    try {
      return new Response(await Proxy.icon.getBackground());
    } catch (e) {}
    return Response.error();
  },
};
