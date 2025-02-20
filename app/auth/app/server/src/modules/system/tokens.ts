import { System } from "modules/system/main.ts";
import { generateToken, getTokenData, compareToken } from "@oh/utils";

export const tokens = () => {
  const getList = async (): Promise<{ id: string; label: string }[]> =>
    (await System.db.list({ prefix: ["appTokens"] })).map(
      ({ value }) => value,
    ) as any[];

  const generate = async (
    label: string,
  ): Promise<{ id: string; token: string }> => {
    const { token, id, tokenHash } = generateToken("tok", 8, 96);
    await System.db.set(["appTokens", id], {
      id,
      label,
      tokenHash,
      updatedAt: Date.now(),
    });

    return {
      id,
      token,
    };
  };

  const remove = async (id: string) => {
    await System.db.delete(["appTokens", id]);
  };

  const verify = async (rawToken: string): Promise<boolean> => {
    if (!rawToken) return false;

    const { id: tokenId, token } = getTokenData(rawToken);
    if (!tokenId || !token) return false;

    const foundToken = await System.db.get(["appTokens", tokenId]);
    if (!foundToken) return false;

    return compareToken(token, foundToken.tokenHash);
  };

  return {
    getList,
    generate,
    verify,
    remove,
  };
};
