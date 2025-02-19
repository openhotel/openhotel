import randomSeed from "@random-seed";
import { getSHA512HashTextHex } from "./encryption.utils.ts";

const V2_CHARACTER_SET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890*!#$&_@%";

export const getSSSPasswordV2 = async (
  password: string,
  service: string,
): Promise<string> => {
  const hexadecimalSeed = await getSHA512HashTextHex(
    password + (await getSHA512HashTextHex(service)) + "2",
  );
  const random = randomSeed.create(hexadecimalSeed);
  let generatedPassword = "";
  for (let i = 0; i < 16; i++)
    generatedPassword += V2_CHARACTER_SET[random(V2_CHARACTER_SET.length)];
  return generatedPassword;
};
