import { getIpFromRequest, getIpFromUrl, getURL, compareIps } from "@oh/utils";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { Proxy } from "modules/proxy/main.ts";

export const getUserDisconnectedRequest = {
  method: "GET",
  pathname: "/auth/user-disconnected",
  fn: async (request: Request): Promise<Response> => {
    const config = Proxy.getConfig();
    if (!config?.auth?.userDisconnectedEvent)
      return Response.json(
        {
          status: 406,
        },
        {
          status: 406,
        },
      );

    const { searchParams } = getURL(request.url);
    const accountId = searchParams.get("accountId");

    const authIp = await getIpFromUrl(config.auth.url);
    const requestIp = getIpFromRequest(request);

    if (!compareIps(authIp, requestIp))
      return Response.json(
        {
          status: 403,
        },
        {
          status: 403,
        },
      );

    const foundUser = Proxy.getUserList().find(
      (user) => user.accountId === accountId,
    );

    if (!foundUser)
      return Response.json(
        {
          status: 404,
        },
        { status: 404 },
      );

    Proxy.getServerWorker().emit(ProxyEvent.$DISCONNECT_USER, {
      data: { accountId },
    });
    return Response.json(
      {
        status: 200,
      },
      { status: 200 },
    );
  },
};
