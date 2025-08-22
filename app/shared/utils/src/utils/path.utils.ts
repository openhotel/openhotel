import * as path from "@std/path";

export const getExecPath = (): string => Deno.execPath();
export const getPath = (): string => path.dirname(getExecPath());

export const getModulePath = (filePath: string = ""): string => {
  const execBase = path.basename(Deno.execPath()).toLowerCase();
  const isCompiled = execBase !== "deno" && execBase !== "deno.exe";

  // Use a stable root that never lives in tmp:
  // - compiled -> directory of the compiled binary
  // - uncompiled -> directory of the entry script
  const root = isCompiled
    ? path.dirname(Deno.execPath())
    : path.dirname(path.fromFileUrl(Deno.mainModule));

  return path.isAbsolute(filePath) ? filePath : path.join(root, filePath);
};
