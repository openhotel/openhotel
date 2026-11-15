import { decodeBase64 as decode, encodeBase64 as encode } from "@std/encoding";

export const encodeBase64 = <Data = any>(object: Data): string => {
  return encode(JSON.stringify(object));
};

export const decodeBase64 = <Data = any>(base64: string): Data => {
  return JSON.parse(new TextDecoder().decode(decode(base64)));
};
