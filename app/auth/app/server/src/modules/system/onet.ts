import { System } from "./main.ts";
import {
  getRandomString,
  getIpFromRequest,
  compareIps,
  getIpFromUrl,
} from "@oh/utils";
import * as bcrypt from "bcrypt";

export const onet = () => {
  const load = async () => {};

  const generateKey = async (api: string): Promise<string> => {
    const key = getRandomString(64);

    const ip = await getIpFromUrl(api);
    await System.db.set(["onetConnection"], {
      keyHash: bcrypt.hashSync(key, bcrypt.genSaltSync(8)),
      api,
      ip,
    });

    return key;
  };

  const getApiUrl = async (): Promise<string | null> => {
    const data = await System.db.get(["onetConnection"]);
    if (!data) return null;
    return data.api;
  };

  const isValidRequest = async (request: Request): Promise<boolean> => {
    console.error("isValidRequest 1", request);
    const data = await System.db.get(["onetConnection"]);
    console.error("isValidRequest 2", data);
    if (!data) return false;

    const remoteIp = getIpFromRequest(request);
    console.error("isValidRequest 3", remoteIp);
    if (!remoteIp) return false;

    if (!compareIps(data.ip, remoteIp)) return false;

    const onetKey = request.headers.get("onet-key");
    console.error("isValidRequest 4", onetKey);
    return bcrypt.compareSync(onetKey, data.keyHash);
  };

  return {
    load,
    generateKey,
    isValidRequest,
    getApiUrl,
  };
};
