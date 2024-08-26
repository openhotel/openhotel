import yamlLibrary from "yaml";
import { System } from "system/main.ts";

export const yaml = () => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const read = async <T extends any>(
    path: string,
    root: boolean = false,
  ): Promise<T> => {
    const data = await System.data.readFile(path, root);
    const content = decoder.decode(data);
    return yamlLibrary.parse(content);
  };

  const write = async <T extends any>(
    filePath: string,
    data: T,
    root: boolean = false,
  ) => {
    const content = yamlLibrary.stringify(data, root);
    const encodedData = encoder.encode(content);

    await System.data.writeFile(filePath, encodedData);
  };

  return {
    read,
    write,
  };
};
