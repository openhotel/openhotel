import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { generateToken, getTokenData } from "@oh/utils";
import { Scope } from "shared/enums/scopes.enums.ts";

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

    const connectionsByAccountId = await System.db.get([
      "connectionsByAccountId",
      accountId,
    ]);
    //remove current connection if exists
    if (connectionsByAccountId)
      await System.db.delete(["connections", connectionsByAccountId]);

    const { token, id: connectionId, tokenHash } = generateToken("con", 24, 32);

    const {
      times: { connectionTokenMinutes },
    } = System.getConfig();
    const expireIn = connectionTokenMinutes * 60 * 1000;

    const scopes = unfilteredScopes.filter((scope) =>
      Object.values(Scope).includes(scope as Scope),
    );

    await System.db.set(
      ["connections", connectionId],
      {
        connectionId,

        hotelId,
        integrationId,

        accountId,
        userAgent,
        ip,

        scopes,

        tokenHash,
      },
      {
        expireIn,
      },
    );

    await System.db.set(["connectionsByAccountId", accountId], connectionId, {
      expireIn,
    });

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

    const currentConnectionId = await System.db.get([
      "connectionsByAccountId",
      accountId,
    ]);

    if (currentConnectionId) {
      const connection = await System.db.get([
        "connections",
        currentConnectionId,
      ]);
      //check if active connection is the same as the deleting one and remove it
      if (
        connection.hotelId === hotelId &&
        connection.integrationId === integrationId
      )
        await System.db.delete(["connections", currentConnectionId]);
    }

    await System.db.delete(["connectionsByAccountId", accountId]);
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

    const foundConnection = await System.db.get(["connections", connectionId]);
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
    const connectionsByAccountId = await System.db.get([
      "connectionsByAccountId",
      accountId,
    ]);

    if (
      !connectionId ||
      !connectionsByAccountId ||
      connectionsByAccountId !== connectionId
    )
      return null;

    const connection = await System.db.get(["connections", connectionId]);
    if (!connection) return null;

    const {
      times: { connectionTokenMinutes },
    } = System.getConfig();
    const expireIn = connectionTokenMinutes * 60 * 1000;

    await System.db.set(["connections", connectionId], connection, {
      expireIn,
    });

    await System.db.set(
      ["connectionsByAccountId", connection.accountId],
      connectionId,
      {
        expireIn,
      },
    );

    const estimatedNextPingIn = expireIn / 2;

    return { estimatedNextPingIn };
  };

  const get = async (rawToken: string) => {
    const { id } = getTokenData(rawToken);
    return await System.db.get(["connections", id]);
  };

  const getList = async (accountId: string) => {
    const connections = (
      await System.db.list({
        prefix: ["integrationsByHotelsByAccountId", accountId],
      })
    ).map(({ value }) => value);

    //get active connection
    const connectionsByAccountId = await System.db.get([
      "connectionsByAccountId",
      accountId,
    ]);

    let currentHotelId;
    let currentIntegrationId;
    if (connectionsByAccountId) {
      const { hotelId, integrationId } = await System.db.get([
        "connections",
        connectionsByAccountId,
      ]);
      currentHotelId = hotelId;
      currentIntegrationId = integrationId;
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
    getList,
  };
};
