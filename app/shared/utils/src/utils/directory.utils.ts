import * as path from "@std/path";
import { exists } from "@std/fs";

export const createDirectoryIfNotExists = async (filePath: string) => {
  const dirPath = path.dirname(filePath);
  if (!(await exists(dirPath))) await Deno.mkdir(dirPath, { recursive: true });
};
