import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { generateToken, getTokenData } from "@oh/utils";

export const licenses = () => {
  const generate = async (accountId: string): Promise<string> => {
    const { token, id, tokenHash } = generateToken("lic", 16, 32);

    const licenseId = await System.db.get(["licensesByAccountId", accountId]);
    if (licenseId) await System.db.delete(["licenses", licenseId]);

    await System.db.set(["licensesByAccountId", accountId], id);
    await System.db.set(["licenses", id], {
      id,
      tokenHash,
      accountId,
      updatedAt: Date.now(),
    });

    return token;
  };

  const remove = async (accountId: string) => {
    const licenseId = await System.db.get(["licensesByAccountId", accountId]);
    if (!licenseId) return;

    await System.db.delete(["licensesByAccountId", accountId]);
    await System.db.delete(["licenses", licenseId]);
  };

  const verify = async (token: string): Promise<boolean> => {
    if (!token) return false;

    const { id: licenseId, token: licenseToken } = getTokenData(token);
    if (!licenseId || !licenseToken) return false;

    const license = await System.db.get(["licenses", licenseId]);
    if (!license) return false;

    return bcrypt.compareSync(licenseToken, license.tokenHash);
  };

  return {
    generate,
    verify,
    remove,
  };
};
