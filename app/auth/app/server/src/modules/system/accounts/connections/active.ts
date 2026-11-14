import {
  AccountActiveConnection,
  AccountConnection,
  DbAccount,
  DbAccountActiveIntegrationConnection,
} from "shared/types/account.types.ts";
import { System } from "modules/system/main.ts";
import { Scope } from "shared/enums/scopes.enums.ts";
import { Connection } from "shared/types/connection.types.ts";
import { generateToken, getIpFromRequest } from "@oh/utils";
import { DbHotelIntegrationType } from "shared/enums/hotel.enums.ts";

export const active = (account: DbAccount): AccountActiveConnection => {
  const create = async ({
    hotelId,
    integrationId,
    request,
    scopes: unfilteredScopes,
    state,
  }: AccountConnection): Promise<string | null> => {
    const hotel = await System.hotels.getHotel({ hotelId });
    if (!hotel) return null;

    const integration = hotel.getIntegration({ integrationId });
    if (!integration) return null;

    const { type } = integration.getObject();

    //remove previous connection
    await remove(type);

    const { token, id: connectionId, tokenHash } = generateToken("con", 24, 32);

    const expireIn = await $getExpirationTime();

    const scopes = unfilteredScopes.filter((scope) =>
      Object.values(Scope).includes(scope as Scope),
    );

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    await System.db.set(
      ["accountByActiveIntegrationConnectionId", connectionId],
      {
        accountId: account.accountId,
        type,
      },
      {
        expireIn,
      },
    );
    await System.db.set(
      ["activeIntegrationConnectionByAccountId", account.accountId, type],
      {
        connectionId,

        hotelId,
        integrationId,
        type,

        accountId: account.accountId,
        userAgent,
        ip,

        scopes,

        tokenHash,
      } as Connection,
      {
        expireIn,
      },
    );

    const $account = await System.accounts.getAccount({
      accountId: account.accountId,
    });

    const foundIntegration = await $account.connections.getConnection(
      hotelId,
      integrationId,
    );

    if (foundIntegration)
      await System.db.set(
        [
          "integrationConnectionByAccountId",
          account.accountId,
          hotelId,
          integrationId,
        ],
        {
          ...foundIntegration,
          updatedAt: Date.now(),
        },
      );
    else
      await System.db.set(
        [
          "integrationConnectionByAccountId",
          account.accountId,
          hotelId,
          integrationId,
        ],
        {
          accountId: account.accountId,

          hotelId,
          integrationId,

          scopes,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      );

    const url = new URL(integration.getObject().redirectUrl);
    url.searchParams.append("state", state);
    url.searchParams.append("token", token);

    if (scopes?.length) url.searchParams.append("scopes", scopes.join(","));

    return url.href;
  };

  const get = async (
    type?: DbHotelIntegrationType,
  ): Promise<DbAccountActiveIntegrationConnection | null> => {
    if (!type) return null;

    return await System.db.get([
      "activeIntegrationConnectionByAccountId",
      account.accountId,
      type,
    ]);
  };

  const getList = async (): Promise<DbAccountActiveIntegrationConnection[]> => {
    const { items } = await System.db.list({
      prefix: ["activeIntegrationConnectionByAccountId", account.accountId],
    });
    return items.map(({ value }) => value);
  };

  const remove = async (type: DbHotelIntegrationType) => {
    const connection = await get(type);
    if (!connection) return;

    await System.db.delete([
      "accountByActiveIntegrationConnectionId",
      connection.connectionId,
    ]);
    await System.db.delete([
      "activeIntegrationConnectionByAccountId",
      account.accountId,
      type,
    ]);
  };

  const ping = async (connectionId: string, request: Request) => {
    const connections = await getList();

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    const connectionFound = connections.find(
      (connection) => connection.connectionId === connectionId,
    );
    if (
      !connectionFound ||
      connectionFound.connectionId !== connectionId ||
      connectionFound.userAgent !== userAgent ||
      connectionFound.ip !== ip
    )
      return null;

    const expireIn = await $getExpirationTime();

    await System.db.set(
      [
        "activeIntegrationConnectionByAccountId",
        account.accountId,
        connectionFound.type,
      ],
      connectionFound,
      {
        expireIn,
      },
    );
    await System.db.set(
      ["accountByActiveIntegrationConnectionId", connectionFound.connectionId],
      {
        accountId: connectionFound.accountId,
        type: connectionFound.type,
      },
      {
        expireIn,
      },
    );

    const estimatedNextPingIn = expireIn / 2;

    return { estimatedNextPingIn };
  };

  const check = async (hotelId: string, integrationId: string) => {
    const connections = await getList();

    return connections.some(
      (connection) =>
        connection.hotelId === hotelId &&
        connection.integrationId === integrationId,
    );
  };

  const checkScopes = async (
    scopes: Scope[],
    type: DbHotelIntegrationType,
  ): Promise<boolean> => {
    const connection = await get(type);
    if (!connection) return false;

    return scopes.every((scope) => connection.scopes.includes(scope));
  };

  const $getExpirationTime = async () => {
    const {
      times: { connectionTokenMinutes },
    } = System.getConfig();
    return System.testMode ? 5 * 1000 : connectionTokenMinutes * 60 * 1000;
  };

  return {
    create,
    get,
    getList,
    remove,

    check,
    checkScopes,

    ping,
  };
};
