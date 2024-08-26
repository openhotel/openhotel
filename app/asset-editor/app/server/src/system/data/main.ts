import { File } from "shared/types/main.ts";
import { DATA_PATH } from "shared/consts/main.ts";
import { yaml } from "./yaml.ts";

export const data = () => {
  const load = async () => {
    await mkdir("/");
  };

  const $getDataPath = (path: string) => `${DATA_PATH}${path}`;

  const mkdir = async (path: string) => {
    await Deno.mkdir($getDataPath(path), {
      recursive: true,
    });
  };

  const readDir = async (path: string): Promise<File[]> => {
    const list = [];
    for await (const { name, isFile, isDirectory } of Deno.readDir(
      $getDataPath(path),
    )) {
      list.push({
        name,
        isFile,
        isDirectory,
      });
    }
    return list;
  };

  const readFile = async (
    path: string,
    root: boolean = false,
  ): Promise<Uint8Array> =>
    await Deno.readFile(root ? path : $getDataPath(path));

  const writeFile = async (
    path: string,
    data: ReadableStream<Uint8Array> | Uint8Array,
    root: boolean = false,
  ) => await Deno.writeFile(root ? path : $getDataPath(path), data);

  const remove = async (path: string, root: boolean = false) =>
    await Deno.remove(root ? path : $getDataPath(path), { recursive: true });

  return {
    load,

    mkdir,
    readDir,

    readFile,
    writeFile,

    remove,

    yaml: yaml(),
  };
};
