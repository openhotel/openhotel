import { System } from "modules/system/main.ts";
import { getIpFromUrl, compareIps, getIpFromRequest } from "@oh/utils";
import * as bcrypt from "bcrypt";
import { Server } from "shared/types/server.types.ts";

export const servers = () => {
  const isValid = async (
    serverId: string,
    token: string,
    requestIp: string,
  ): Promise<boolean> => {
    if (!serverId || !token) return false;

    const server = await System.db.get(["servers", serverId]);
    if (!server) return false;

    const dnsIp = await getIpFromUrl(server.hostname);
    if (!compareIps(dnsIp, requestIp) || requestIp !== server.ip) return false;

    return bcrypt.compareSync(token, server.tokenHash);
  };

  const isRequestValid = (request: Request): Promise<boolean> => {
    const serverId = request.headers.get("server-id");
    const token = request.headers.get("token");
    const requestIp = getIpFromRequest(request);

    return isValid(serverId, token, requestIp);
  };

  const getServerData = (serverId: string): Promise<Server | null> =>
    System.db.get(["servers", serverId]);

  return {
    isValid,
    isRequestValid,
    getServerData,
  };
};
