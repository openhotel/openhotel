import { RequestMethod, RequestType } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { Service } from "shared/enums/services.enums.ts";

export const serverRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/server",
  func: async (request: Request, url) => {
    if (!(await System.tokens.isValidRequest(request, Service.ONET)))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { serverId, token, ip } = await request.json();

    if (!serverId || !token || !ip)
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

    const serverData = await System.servers.getServerData(serverId);

    return Response.json(
      {
        status: 200,
        data: {
          hostname: serverData.hostname,
        },
      },
      {
        status: 200,
      },
    );
  },
};
