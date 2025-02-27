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

    //remove previous connection
    await remove();

    const { token, id: connectionId, tokenHash } = generateToken("con", 24, 32);

    const expireIn = await $getExpirationTime();

    const scopes = unfilteredScopes.filter((scope) =>
      Object.values(Scope).includes(scope as Scope),
    );

    const userAgent = request.headers.get("user-agent");
    const fingerprint = request.headers.get("fingerprint");
    const ip = getIpFromRequest(request);

    await System.db.set(
      ["accountByActiveIntegrationConnectionId", connectionId],
      account.accountId,
      {
        expireIn,
      },
    );
    await System.db.set(
      ["activeIntegrationConnectionByAccountId", account.accountId],
      {
        connectionId,

        hotelId,
        integrationId,

        accountId: account.accountId,
        userAgent,
        ip,
        fingerprint,

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
    url.searchParams.append("fingerprint", fingerprint);

    if (scopes?.length) url.searchParams.append("scopes", scopes.join(","));

    return url.href;
  };

  const get =
    async (): Promise<DbAccountActiveIntegrationConnection | null> => {
      return await System.db.get([
        "activeIntegrationConnectionByAccountId",
        account.accountId,
      ]);
    };

  const remove = async () => {
    const connection = await get();
    if (!connection) return;

    await System.db.delete([
      "accountByActiveIntegrationConnectionId",
      connection.connectionId,
    ]);
    await System.db.delete([
      "activeIntegrationConnectionByAccountId",
      account.accountId,
    ]);
  };

  const ping = async (connectionId: string, request: Request) => {
    const connection = await get();

    const fingerprint = request.headers.get("fingerprint");

    if (
      !connection ||
      connection.connectionId !== connectionId ||
      connection.fingerprint !== fingerprint
    )
      return null;

    const expireIn = await $getExpirationTime();

    await System.db.set(
      ["activeIntegrationConnectionByAccountId", account.accountId],
      connection,
      {
        expireIn,
      },
    );
    await System.db.set(
      ["accountByActiveIntegrationConnectionId", connection.connectionId],
      connection.accountId,
      {
        expireIn,
      },
    );

    const estimatedNextPingIn = expireIn / 2;

    return { estimatedNextPingIn };
  };

  const check = async (hotelId: string, integrationId: string) => {
    const connection = await get();
    return (
      connection &&
      connection.hotelId === hotelId &&
      connection.integrationId === integrationId
    );
  };

  const checkScopes = async (scopes: Scope[]): Promise<boolean> => {
    const connection = await get();
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
    remove,

    check,
    checkScopes,

    ping,
  };
};
