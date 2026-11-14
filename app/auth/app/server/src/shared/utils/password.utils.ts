import { BCRYPT_MAX_LENGTH } from "shared/consts/password.consts.ts";
import { System } from "modules/system/main.ts";

export const getPasswordMaxLength = async (): Promise<number> => {
  const pepper = await System.db.crypto.pepperPassword("");

  return BCRYPT_MAX_LENGTH - pepper.length;
};
