import { Proxy } from "modules/proxy/main.ts";

export const getInfoRequest = {
  method: "GET",
  pathname: "/info",
  fn: async (request: Request): Promise<Response> => {
    const {
      name,
      description,
      auth,
      onet,
      limits: { players: maxUsers },
      lang,
    } = Proxy.getConfig();
    const { version } = Proxy.getEnvs();
    const userList = Proxy.getUserList();

    return Response.json(
      {
        status: 200,
        data: {
          name,
          description,
          version,
          lang,
          auth: {
            enabled: auth.enabled,
            api: auth.api,
          },
          onet: {
            enabled: onet.enabled,
          },
          users: userList.length,
          maxUsers,
        },
      },
      { status: 200 },
    );
  },
};
