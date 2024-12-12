import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { generateToken, getTokenData } from "@oh/utils";
import { Scope } from "shared/enums/scopes.enums.ts";
import { Connection } from "shared/types/connection.types.ts";

type GenerateProps = {
  hotelId: string;
  integrationId: string;

  accountId: string;
  userAgent: string;
  ip: string;

  scopes: string[];

  state: string;
};

export const connections = () => {
  const generate = async ({
    hotelId,
    integrationId,
    accountId,
    userAgent,
    ip,
    scopes: unfilteredScopes,
    state,
  }: GenerateProps): Promise<string> => {
    const hotel = await System.hotels.get(hotelId);
    if (!hotel) return;

    const foundIntegration = hotel.integrations.find(
      (integration) => integrationId === integration.integrationId,
    );
    if (!foundIntegration) return;

    //remove current connection if exists
    await System.db.delete(["connections", accountId]);

    const { token, id: connectionId, tokenHash } = generateToken("con", 24, 32);

    const {
      times: { connectionTokenMinutes },
    } = System.getConfig();
    const expireIn = connectionTokenMinutes * 60 * 1000;

    const scopes = unfilteredScopes.filter((scope) =>
      Object.values(Scope).includes(scope as Scope),
    );

    await System.db.set(["accountByConnectionId", connectionId], accountId, {
      expireIn,
    });
    await System.db.set(
      ["connections", accountId],
      {
        connectionId,

        hotelId,
        integrationId,

        accountId,
        userAgent,
        ip,

        scopes,

        tokenHash,
      } as Connection,
      {
        expireIn,
      },
    );

    await System.db.set(
      ["integrationsByHotelsByAccountId", accountId, hotelId, integrationId],
      {
        accountId,

        hotelId,
        integrationId,

        scopes,
        updatedAt: Date.now(),
      },
    );

    const url = new URL(foundIntegration.redirectUrl);
    url.searchParams.append("state", state);
    url.searchParams.append("token", token);

    if (scopes?.length) url.searchParams.append("scopes", scopes.join(","));

    return url.href;
  };

  const remove = async (
    accountId: string,
    hotelId: string,
    integrationId: string,
  ): Promise<boolean> => {
    const hotel = await System.hotels.get(hotelId);
    if (!hotel) return false;

    const integration = hotel.integrations.find(
      (integration) => integrationId === integration.integrationId,
    );
    if (!integration) return false;

    const connection = await System.db.get(["connections", accountId]);
    //check if active connection is the same as the deleting one and remove it
    if (
      connection &&
      connection.hotelId === hotelId &&
      connection.integrationId === integrationId
    )
      await System.db.delete(["connections", accountId]);

    await System.db.delete([
      "integrationsByHotelsByAccountId",
      accountId,
      hotelId,
      integrationId,
    ]);

    return true;
  };

  const verify = async (
    rawToken: string,
    scopes: string[],
  ): Promise<boolean> => {
    if (!rawToken) return false;

    const { id: connectionId, token } = getTokenData(rawToken);
    if (!connectionId || !token) return false;

    const accountId = await System.db.get([
      "accountByConnectionId",
      connectionId,
    ]);
    if (!accountId) return false;

    const foundConnection = await System.db.get(["connections", accountId]);
    if (!foundConnection) return false;

    return (
      scopes.every((scope) => foundConnection.scopes.includes(scope)) &&
      bcrypt.compareSync(token, foundConnection.tokenHash)
    );
  };

  const ping = async (
    accountId: string,
    connectionId: string,
  ): Promise<null | { estimatedNextPingIn: number }> => {
    const connection = await System.db.get(["connections", accountId]);
    if (!connection || connection.connectionId !== connectionId) return null;

    const {
      times: { connectionTokenMinutes },
    } = System.getConfig();
    const expireIn = connectionTokenMinutes * 60 * 1000;

    await System.db.set(["connections", accountId], connection, {
      expireIn,
    });
    await System.db.set(["accountByConnectionId", connectionId], accountId, {
      expireIn,
    });

    const estimatedNextPingIn = expireIn / 2;

    return { estimatedNextPingIn };
  };

  const get = async (rawToken: string): Promise<Connection> => {
    const { id: connectionId } = getTokenData(rawToken);
    const accountId = await System.db.get([
      "accountByConnectionId",
      connectionId,
    ]);
    return await System.db.get(["connections", accountId]);
  };

  const getConnection = async (
    accountId: string,
  ): Promise<Connection | null> => {
    return await System.db.get(["connections", accountId]);
  };

  const getList = async (accountId: string) => {
    const connections = (
      await System.db.list({
        prefix: ["integrationsByHotelsByAccountId", accountId],
      })
    ).map(({ value }) => value);

    //get active connection

    let currentHotelId;
    let currentIntegrationId;
    const connection = await System.db.get(["connections", accountId]);
    if (connection) {
      currentHotelId = connection.hotelId;
      currentIntegrationId = connection.integrationId;
    }

    const connectionsList = [];

    for (const connection of connections) {
      const hotel = await System.hotels.get(connection.hotelId);
      const ownerAccount = await System.accounts.get(hotel.accountId);

      let foundHotel = connectionsList.find(
        (hotel) => hotel.hotelId === connection.hotelId,
      );

      if (!foundHotel) {
        connectionsList.push({
          hotelId: connection.hotelId,
          name: hotel.name,
          owner: ownerAccount.username,
          //TODO
          verified: false,

          connections: [],
        });
        foundHotel = connectionsList[connectionsList.length - 1];
      }

      const integration = hotel.integrations.find(
        (integration) => integration.integrationId === connection.integrationId,
      );

      const connectionData = {
        integrationId: connection.integrationId,
        scopes: connection.scopes,
        name: integration.name,
        redirectUrl: integration.redirectUrl,
        type: integration.type,
        active: Boolean(
          currentHotelId &&
            currentIntegrationId &&
            currentHotelId === connection.hotelId &&
            currentIntegrationId === connection.integrationId,
        ),
      };
      foundHotel.connections.push(connectionData);
    }
    return connectionsList;
  };

  return {
    generate,
    verify,
    remove,
    ping,
    get,
    getConnection,
    getList,
  };
};
