import { System } from "modules/system/main.ts";
import { generateToken, getTokenData, compareToken } from "@oh/utils";

export const apps = () => {
  const get = async (tokenId: string): Promise<{ id: string; url: string }> => {
    const data = await System.db.get(["apps", tokenId]);

    return data
      ? {
          id: data.id,
          url: data.url,
        }
      : null;
  };

  const getList = async (): Promise<{ id: string; url: string }[]> => {
    const { items } = await System.db.list({ prefix: ["apps"] });
    return items.map(({ value }) => value);
  };

  const generate = async (
    url: string,
  ): Promise<{ id: string; token: string }> => {
    const { token, id, tokenHash } = generateToken("app", 32, 64);
    await System.db.set(["apps", id], {
      id,
      url,
      tokenHash,
      updatedAt: Date.now(),
    });

    return {
      id,
      token,
    };
  };

  const remove = async (id: string) => {
    await System.db.delete(["apps", id]);
  };

  const verify = async (rawToken: string): Promise<boolean> => {
    if (!rawToken) return false;

    const { id: tokenId, token } = getTokenData(rawToken);
    if (!tokenId || !token) return false;

    const foundToken = await System.db.get(["apps", tokenId]);
    if (!foundToken) return false;

    return compareToken(token, foundToken.tokenHash);
  };

  return {
    get,
    getList,
    generate,
    verify,
    remove,
  };
};
