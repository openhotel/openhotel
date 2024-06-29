import { ReadProps, WriteProps } from "shared/types/yaml.types.ts";
import yamlLibrary from "yaml";
import { createDirectoryIfNotExists } from "./directory.utils.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const readYaml = async <T extends any>(
  filePath: string,
  { decode = false }: ReadProps = { decode: false },
): Promise<T> => {
  let content = await Deno.readTextFile(filePath);
  if (decode)
    content = decoder.decode(new Uint8Array(content.split(",").map(Number)));
  return yamlLibrary.parse(content);
};

export const writeYaml = async <T extends any>(
  filePath: string,
  data: T,
  { encode = false, async = false }: WriteProps = {
    encode: false,
    async: false,
  },
) => {
  await createDirectoryIfNotExists(filePath);

  let content = yamlLibrary.stringify(data);
  if (encode) content = encoder.encode(content);

  const write = () => Deno.writeTextFile(filePath, content);

  async ? await write() : write();
};
