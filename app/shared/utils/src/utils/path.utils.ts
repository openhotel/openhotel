import * as path from "@std/path";

export const getExecPath = (): string => Deno.execPath();
export const getPath = (): string => path.dirname(getExecPath());

export const getModulePath = (filePath: string = ""): string =>
  path.join(path.dirname(path.fromFileUrl(Deno.mainModule)), filePath);
