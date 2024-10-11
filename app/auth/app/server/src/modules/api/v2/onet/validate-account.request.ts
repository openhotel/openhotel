import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { Session } from "shared/types/session.types.ts";

export const validateAccountRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/validate-account",
  func: async (request: Request, url) => {
    if (!(await System.onet.isValidRequest(request)))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { serverId, token, ip, accountId } = await request.json();

    if (!serverId || !token || !ip || !accountId)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    if (!(await System.servers.isValid(serverId, token, ip)))
      return Response.json(
        { status: 404 },
        {
          status: 404,
        },
      );

    // get active session
    const serverSession: Session = await System.db.get([
      "serverSessionByAccount",
      accountId,
    ]);

    //user is not connected or not connected to the current server
    if (!serverSession || serverSession?.serverIp !== ip)
      return Response.json(
        { status: 401 },
        {
          status: 401,
        },
      );

    return Response.json(
      {
        status: 200,
      },
      {
        status: 200,
      },
    );
  },
};
