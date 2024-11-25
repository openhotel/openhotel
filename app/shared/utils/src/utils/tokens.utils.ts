import { getRandomString } from "./random.utils.ts";
import * as bcrypt from "bcrypt";

export const generateToken = (
  label: string,
  idLength: number,
  tokenLength: number,
) => {
  const id = getRandomString(idLength);
  const token = getRandomString(tokenLength);
  const tokenHash = bcrypt.hashSync(token, bcrypt.genSaltSync(8));

  return {
    token: `${label}.${id}.${token}`,
    id,
    tokenHash,
  };
};

export const getTokenData = (license: string) => {
  const [label, id, token] = license.split(".");
  return { label, id, token };
};
