import {
  RequestType,
  RequestMethod,
  getIpFromRequest,
  getIpFromUrl,
  compareIps,
  getRandomString,
} from "@oh/utils";
import * as bcrypt from "bcrypt";
import { System } from "modules/system/main.ts";

export const registerRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/register",
  func: async (request: Request, url) => {
    let { version, ip } = await request.json();

    const { development, version: currentVersion } = System.getConfig();
    const isDevelopment = development || currentVersion === "development";

    if (!version || (!isDevelopment && !ip))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const dnsIp = await getIpFromUrl(ip);
    const requestIp = getIpFromRequest(request);

    if (!compareIps(dnsIp, requestIp))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { hostname } = new URL(ip);

    //already exists
    const serverByHostname = await System.db.get([
      "serverByHostname",
      hostname,
    ]);

    const serverId = serverByHostname ?? crypto.randomUUID();
    const token = getRandomString(32);

    await System.db.set(["servers", serverId], {
      serverId,
      hostname,
      ip: requestIp,
      tokenHash: bcrypt.hashSync(token, bcrypt.genSaltSync(8)),
    });

    await System.db.set(["serverByHostname", hostname], serverId);

    return Response.json(
      {
        status: 200,
        data: {
          serverId,
          token,
        },
      },
      {
        status: 200,
      },
    );
  },
};
