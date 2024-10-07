import * as path from "@std/path";

export const getExecPath = () => Deno.execPath();
export const getPath = () => path.dirname(getExecPath());
