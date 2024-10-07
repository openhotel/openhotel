import * as path from "@std/path";

export const getExecPath = (): string => Deno.execPath();
export const getPath = (): string => path.dirname(getExecPath());
