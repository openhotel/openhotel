import {
  DATABASE_KEY_FILE,
  DATABASE_PEPPER_FILE,
} from "../../consts/db.consts.ts";
import { DbCryptoMutable, type DbProps } from "../../types/db.types.ts";
import { ulid } from "jsr:@std/ulid@1";
import {
  compareToken,
  decryptSHA256,
  encryptSHA256,
  encryptToken,
} from "../../utils/encryption.utils.ts";

export const crypto = ({ pathname }: DbProps): DbCryptoMutable => {
  const load = async () => {
    //generate pep (pepper)
    try {
      await Deno.stat(pathname + DATABASE_PEPPER_FILE);
    } catch (e) {
      await Deno.writeTextFile(pathname + DATABASE_PEPPER_FILE, ulid());
    }

    //generate key (hash)
    try {
      await Deno.stat(pathname + DATABASE_KEY_FILE);
    } catch (e) {
      await Deno.writeTextFile(pathname + DATABASE_KEY_FILE, ulid());
    }
  };

  /////////////////////////////////////////////////////////////////////
  ///////ENCRYPT/DECRYPT///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  const getSecretKey = (): Promise<string> =>
    Deno.readTextFile(pathname + DATABASE_KEY_FILE);

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
    Deno.readTextFile(pathname + DATABASE_PEPPER_FILE);

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
