import { Proxy } from "modules/proxy/main.ts";

export const getConfigRequest = {
  method: "GET",
  pathname: "/config",
  fn: async (request: Request): Promise<Response> => {
    const { name, description, version, auth, onet } = Proxy.getConfig();

    return Response.json(
      {
        status: 200,
        data: {
          name,
          description,
          version,
          auth: {
            enabled: auth.enabled,
            api: auth.api,
          },
          onet: {
            enabled: onet.enabled,
          },
        },
      },
      { status: 200 },
    );
  },
};
