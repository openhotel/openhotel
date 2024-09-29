import { ApiRequestProps } from "shared/types/api.types.ts";
import { getIpFromRequest, getIpFromUrl } from "shared/utils/ip.utils.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export const getUserDisconnectedRequest = {
  method: "GET",
  pathname: "/auth/user-disconnected",
  fn: async ({
    request,
    config,
    serverWorker,
    userList,
  }: ApiRequestProps): Promise<Response> => {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    const authIp = await getIpFromUrl(config.auth.redirectUrl);
    const requestIp = getIpFromRequest(request);

    const isAuthServer =
      //check if is local network
      requestIp.startsWith("192.168.") ||
      //check if is local computer
      requestIp.startsWith("172.") ||
      //check if is equal
      authIp === requestIp;

    console.warn(authIp, requestIp, "1");
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

    console.warn(authIp, requestIp, "2");
    if (!foundUser)
      return Response.json(
        {
          status: 404,
        },
        { status: 404 },
      );
    console.warn(foundUser, "3");
    serverWorker.emit(ProxyEvent.$DISCONNECT_USER, {
      clientId: foundUser.clientId,
    });
    return Response.json(
      {
        status: 200,
      },
      { status: 200 },
    );
  },
};
