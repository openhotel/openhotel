import { System } from "./main.ts";
import {
  getRandomString,
  getIpFromRequest,
  compareIps,
  getIpFromUrl,
  RequestMethod,
} from "@oh/utils";
import * as bcrypt from "bcrypt";
import { Service } from "shared/enums/services.enums.ts";
import { isServiceValid } from "shared/utils/services.utils.ts";

export const tokens = () => {
  const load = async () => {};

  const generateKey = async (
    service: string,
    api: string,
  ): Promise<{ key: string; token: string }> => {
    const key = getRandomString(64);
    const token = getRandomString(64);

    const ip = await getIpFromUrl(api);
    await System.db.set(["tokens", service], {
      keyHash: bcrypt.hashSync(key, bcrypt.genSaltSync(8)),
      token,
      api,
      ip,
    });

    return { key, token };
  };

  const getApiUrl = async (service: Service): Promise<string | null> => {
    const data = await System.db.get(["tokens", service]);
    if (!data) return null;
    return data.api;
  };

  const isValidRequest = async (
    request: Request,
    service?: Service,
  ): Promise<boolean> => {
    const tokenService = request.headers.get("token-service");
    if (service ? tokenService !== service : !isServiceValid(tokenService))
      return false;

    const data = await System.db.get(["tokens", tokenService]);
    if (!data) return false;

    const remoteIp = getIpFromRequest(request);
    if (!remoteIp) return false;

    if (!compareIps(data.ip, remoteIp)) return false;

    const tokenKey = request.headers.get("token-key");
    return bcrypt.compareSync(tokenKey, data.keyHash);
  };

  const $fetch = async <Data>(
    method: RequestMethod,
    pathname: string,
    service: Service,
    data?: unknown,
  ): Promise<Data> => {
    const tokenData = await System.db.get(["tokens", service]);
    if (!tokenData) throw `No service ${service} data!`;

    const headers = new Headers();
    headers.append("token", tokenData.token);

    const { status, data: responseData } = await fetch(
      `${tokenData.api}${pathname}`,
      {
        method,
        body: data ? JSON.stringify(data) : null,
        headers,
      },
    ).then((response) => response.json());

    if (status !== 200) throw Error(`Status ${status}!`);

    return responseData as Data;
  };

  return {
    load,
    generateKey,
    isValidRequest,
    getApiUrl,
    $fetch,
  };
};
