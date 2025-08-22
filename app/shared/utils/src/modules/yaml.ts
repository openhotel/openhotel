import { parse, stringify } from "@std/yaml";
import { createDirectoryIfNotExists } from "../utils/directory.utils.ts";
import { getModulePath } from "../utils/path.utils.ts";

export type ReadProps = {
  decode?: boolean;
};

export type WriteProps = {
  encode?: boolean;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const readYaml = async <T extends unknown>(
  filePath: string,
  { decode = false }: ReadProps = { decode: false },
): Promise<T | unknown> => {
  let content = await Deno.readTextFile(getModulePath(filePath));
  if (decode)
    content = decoder.decode(new Uint8Array(content.split(",").map(Number)));
  return parse(content);
};

export const writeYaml = async <T extends any>(
  filePath: string,
  data: T,
  { encode = false }: WriteProps = {
    encode: false,
  },
): Promise<void> => {
  await createDirectoryIfNotExists(getModulePath(filePath));

  let content = stringify(data);
  //@ts-ignore
  if (encode) content = encoder.encode(content);

  console.log(getModulePath(filePath), content);
  await Deno.writeTextFile(getModulePath(filePath), content);
};
