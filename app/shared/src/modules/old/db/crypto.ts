import { ulid } from "@std/ulid";
import { DbCryptoMutable, DbProps } from "@shared/types/db.types.ts";
import { getModulePath } from "@shared/utils/path.utils.ts";
import {
  DATABASE_KEY_FILE,
  DATABASE_PEPPER_FILE,
} from "@shared/consts/db.consts.ts";
import {
  compareToken,
  decryptSHA256,
  encryptSHA256,
  encryptToken,
} from "@shared/utils/encryption.utils.ts";

export const crypto = ({ pathname }: DbProps): DbCryptoMutable => {
  const load = async () => {
    //generate pep (pepper)
    try {
      await Deno.stat(getModulePath(pathname) + DATABASE_PEPPER_FILE);
    } catch (e) {
      await Deno.writeTextFile(
        getModulePath(pathname) + DATABASE_PEPPER_FILE,
        ulid(),
      );
    }

    //generate key (hash)
    try {
      await Deno.stat(getModulePath(pathname) + DATABASE_KEY_FILE);
    } catch (e) {
      await Deno.writeTextFile(
        getModulePath(pathname) + DATABASE_KEY_FILE,
        ulid(),
      );
    }
  };

  /////////////////////////////////////////////////////////////////////
  ///////ENCRYPT/DECRYPT///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  const getSecretKey = (): Promise<string> =>
    Deno.readTextFile(getModulePath(pathname) + DATABASE_KEY_FILE);

  const $encryptSHA256 = async (text: string): Promise<string> => {
    return await encryptSHA256(text, await getSecretKey());
  };

  const $decryptSHA256 = async (hash: string): Promise<string> => {
    return await decryptSHA256(hash, await getSecretKey());
  };

  /////////////////////////////////////////////////////////////////////
  ///////BCRYPT/WITH/PEPPER////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  const getPepper = (): Promise<string> =>
    Deno.readTextFile(getModulePath(pathname) + DATABASE_PEPPER_FILE);

  const pepperPassword = async (password: string): Promise<string> =>
    (await getPepper()) + ":" + password;

  const $encryptPassword = async (password: string) =>
    encryptToken(await pepperPassword(password));

  const $comparePassword = async (
    password: string,
    passwordHash: string,
  ): Promise<boolean> =>
    compareToken(await pepperPassword(password), passwordHash);

  return {
    load,

    getSecretKey,

    getPepper,
    pepperPassword,

    encryptSHA256: $encryptSHA256,
    decryptSHA256: $decryptSHA256,

    encryptPassword: $encryptPassword,
    comparePassword: $comparePassword,
  };
};
