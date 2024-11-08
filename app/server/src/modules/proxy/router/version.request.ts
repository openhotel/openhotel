import { Proxy } from "modules/proxy/main.ts";

export const getVersionRequest = {
  method: "GET",
  pathname: "/version",
  fn: async (request: Request): Promise<Response> => {
    const { version } = Proxy.getEnvs();

    return Response.json(
      {
        status: 200,
        data: {
          version,
        },
      },
      { status: 200 },
    );
  },
};
