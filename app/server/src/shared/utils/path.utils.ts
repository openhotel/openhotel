import * as path from "deno/path/mod.ts";

export const getExecPath = () => Deno.execPath();
export const getPath = () => path.dirname(getExecPath());
