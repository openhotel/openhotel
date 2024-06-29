import * as path from "deno/path/mod.ts";
import { exists } from "deno/fs/mod.ts";

export const createDirectoryIfNotExists = async (filePath: string) => {
  const dirPath = path.dirname(filePath);
  if (!(await exists(dirPath))) await Deno.mkdir(dirPath, { recursive: true });
};
