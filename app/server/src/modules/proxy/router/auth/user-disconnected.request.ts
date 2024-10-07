import { ApiRequestProps } from "shared/types/api.types.ts";
import { getIpFromRequest, getIpFromUrl } from "shared/utils/ip.utils.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { getURL } from "shared/utils/urls.utils.ts";

export const getUserDisconnectedRequest = {
  method: "GET",
  pathname: "/auth/user-disconnected",
  fn: async ({
    request,
    config,
    serverWorker,
    userList,
  }: ApiRequestProps): Promise<Response> => {
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

    const isAuthServer =
      //check if is local network
      requestIp.startsWith("192.168.") ||
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

    const foundUser = userList.find((user) => user.accountId === accountId);

    if (!foundUser)
      return Response.json(
        {
          status: 404,
        },
        { status: 404 },
      );

    serverWorker.emit(ProxyEvent.$DISCONNECT_USER, {
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
