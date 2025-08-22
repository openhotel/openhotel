import * as path from "@std/path";

export const getExecPath = (): string => Deno.execPath();
export const getPath = (): string => path.dirname(getExecPath());

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

export const getLocalPath = (filePath: string): string => {
  if (filePath.startsWith("/") || /^[A-Za-z]:\\/.test(filePath)) {
    return filePath; // already absolute
  }
  return path.join(__dirname, filePath);
};

export const getModulePath = (filePath: string): string =>
  path.join(path.dirname(path.fromFileUrl(Deno.mainModule)), filePath);
