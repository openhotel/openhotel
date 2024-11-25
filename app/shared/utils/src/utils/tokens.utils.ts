import { getRandomString } from "./random.utils.ts";
import * as bcrypt from "@da/bcrypt";

type GenToken = {
  token: string;
  id: string;
  tokenHash: string;
};

type Token = {
  label: string;
  token: string;
  id: string;
};

export const generateToken = (
  label: string,
  idLength: number,
  tokenLength: number,
): GenToken => {
  const id = getRandomString(idLength);
  const token = getRandomString(tokenLength);
  const tokenHash = bcrypt.hashSync(token, bcrypt.genSaltSync(8));

  return {
    token: `${label}.${id}.${token}`,
    id,
    tokenHash,
  };
};

export const getTokenData = (license: string): Token => {
  const [label, id, token] = license.split(".");
  return { label, id, token };
};
