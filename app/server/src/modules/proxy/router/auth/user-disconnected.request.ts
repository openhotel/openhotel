import { Server } from "modules/server/main.ts";
import { ApiRequestProps } from "shared/types/api.types.ts";
import { getIpFromRequest, getIpFromUrl } from "shared/utils/ip.utils.ts";

export const getUserDisconnectedRequest = {
  method: "GET",
  pathname: "/auth/user-disconnected",
  fn: async ({ request, config, envs }: ApiRequestProps): Promise<Response> => {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    const authIp = await getIpFromUrl(config.auth.redirectUrl);
    const requestIp = getIpFromRequest(request);

    const isAuthServer = authIp === requestIp;
    if (!isAuthServer)
      return Response.json(
        {
          status: 403,
        },
        {
          status: 403,
        },
      );

    Server.game.users.get({ accountId }).disconnect();
    return Response.json(
      {
        status: 200,
      },
      { status: 200 },
    );
  },
};
