import * as path from "@std/path";

export const getExecPath = (): string => Deno.execPath();
export const getPath = (): string => path.dirname(getExecPath());

export const getModulePath = (filePath: string = ""): string => {
  // If running uncompiled (`deno run main.ts`), use Deno.mainModule
  const root = Deno.mainModule.startsWith("file:")
    ? path.dirname(path.fromFileUrl(Deno.mainModule))
    : path.dirname(getExecPath());

  return path.join(root, filePath);
};
