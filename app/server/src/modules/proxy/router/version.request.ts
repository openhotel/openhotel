import { Proxy } from "modules/proxy/main.ts";

export const getVersionRequest = {
  method: "GET",
  pathname: "/version",
  fn: async (request: Request): Promise<Response> => {
    const { version } = Proxy.getEnvs();
    const { development } = Proxy.getConfig();

    return Response.json(
      {
        status: 200,
        data: {
          version,
          development,
        },
      },
      { status: 200 },
    );
  },
};
