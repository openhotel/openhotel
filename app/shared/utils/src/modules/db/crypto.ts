import {
  DATABASE_KEY_FILE,
  DATABASE_PEPPER_FILE,
} from "../../consts/db.consts.ts";
import { DbCryptoMutable, type DbProps } from "../../types/db.types.ts";
import { ulid } from "jsr:@std/ulid@1";
import * as bcrypt from "@da/bcrypt";
import { decryptSHA256, encryptSHA256 } from "../../utils/encryption.utils.ts";

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
    bcrypt.hashSync(await pepperPassword(password), bcrypt.genSaltSync(8));

  const $comparePassword = async (
    password: string,
    passwordHash: string,
  ): Promise<boolean> =>
    bcrypt.compareSync(await pepperPassword(password), passwordHash);

  return {
    load,

    encryptSHA256: $encryptSHA256,
    decryptSHA256: $decryptSHA256,

    encryptPassword: $encryptPassword,
    comparePassword: $comparePassword,
  };
};
