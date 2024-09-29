import { Server } from "modules/server/main.ts";
import { ApiRequestProps } from "shared/types/api.types.ts";
import { getIpFromRequest, getIpFromUrl } from "shared/utils/ip.utils.ts";
import { System } from "app/client/src/system";

export const getUserDisconnectedRequest = {
  method: "GET",
  pathname: "/auth/user-disconnected",
  fn: async ({ request, config, envs }: ApiRequestProps): Promise<Response> => {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    const authIp = await getIpFromUrl(config.auth.redirectUrl);
    const requestIp = getIpFromRequest(request);

    const isAuthServer =
      //check if is local network
      requestIp.startsWith("192.168") ||
      //check if is local computer
      requestIp.startsWith("172.") ||
      //check if is equal
      authIp === requestIp;

    if (!isAuthServer)
      return Response.json(
        {
          status: 403,
        },
        {
          status: 403,
        },
      );

    console.error(
      accountId,
      Server.game.users.get({ accountId }),
      Server.game.users.$userMap,
      Server.game.users.getList().map((c) => c.getObject()),
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
