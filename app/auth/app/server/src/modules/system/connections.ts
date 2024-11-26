import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { generateToken, getTokenData } from "@oh/utils";
import {
  RequestType,
  RequestMethod,
  getRandomString,
  getIpFromRequest,
} from "@oh/utils";
import { Scope } from "shared/enums/scopes.enums.ts";

type GenerateProps = {
  accountId: string;
  userAgent: string;
  ip: string;

  hostname: string;
  scopes: string[];
  redirectUrl: string;

  state: string;
};

export const connections = () => {
  const generate = async ({
    accountId,
    userAgent,
    ip,
    hostname,
    scopes: unfilteredScopes,
    redirectUrl,
    state,
  }: GenerateProps): Promise<{
    connectionId: string;
    token: string;
    redirectUrl: string;
  }> => {
    const connectionsByAccountId = await System.db.get([
      "connectionsByAccountId",
      accountId,
    ]);
    //remove current connection if exists
    if (connectionsByAccountId)
      await System.db.delete([
        "connections",
        connectionsByAccountId.connectionId,
      ]);

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
        userAgent,
        ip,
        hostname,
        accountId,
        tokenHash,
        scopes,
        redirectUrl,
      },
      {
        expireIn,
      },
    );

    await System.db.set(
      ["connectionsByAccountId", accountId],
      {
        connectionId,
      },
      {
        expireIn,
      },
    );

    await System.db.set(["hostsByHostname", hostname, accountId], {
      hostname,
      updatedAt: Date.now(),
    });
    await System.db.set(["hostsByAccountId", accountId, hostname], {
      hostname,
      scopes,
      updatedAt: Date.now(),
    });

    if (!(await System.db.get(["hosts", hostname])))
      await System.db.set(["hosts", hostname], {
        hostname,
        createdAt: Date.now(),
      });

    console.log(scopes);
    return {
      connectionId,
      token,
      redirectUrl:
        redirectUrl +
        `?state=${state}&token=${token}${scopes?.length ? `&scopes=${scopes.join(",")}` : ""}`,
    };
  };

  const remove = async (
    accountId: string,
    hostname: string,
  ): Promise<boolean> => {
    if (!(await System.db.get(["hostsByHostname", hostname, accountId])))
      return false;

    const currentConnection = await System.db.get([
      "connectionsByAccountId",
      accountId,
    ]);

    if (currentConnection) {
      const connection = await System.db.get([
        "connections",
        currentConnection.connectionId,
      ]);
      if (connection.hostname === hostname)
        await System.db.delete(["connections", currentConnection.connectionId]);
    }

    await System.db.delete(["connectionsByAccountId", accountId]);
    await System.db.delete(["hostsByHostname", hostname, accountId]);
    await System.db.delete(["hostsByAccountId", accountId, hostname]);

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
      connectionsByAccountId.connectionId !== connectionId
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
      {
        connectionId,
      },
      {
        expireIn,
      },
    );

    const estimatedNextPingIn = expireIn / 2;

    return { estimatedNextPingIn };
  };

  const get = async (rawToken: string) => {
    const { id } = getTokenData(rawToken);
    console.log(id, rawToken);
    return await System.db.get(["connections", id]);
  };

  return {
    generate,
    verify,
    remove,
    ping,
    get,
  };
};
