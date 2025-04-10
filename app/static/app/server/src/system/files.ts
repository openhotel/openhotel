import { System } from "system/main.ts";
import { type File } from "shared/types/main.ts";
import { getS3, S3Mutable } from "@oh/utils";
import { join } from "@std/path";

const FILES_PATH = "files";

export const files = () => {
  let s3Client: S3Mutable;
  let isEnabled: boolean = false;

  const load = async () => {
    const { enabled, ...configS3 } = System.getConfig().s3;
    if (!enabled) {
      try {
        await Deno.mkdir(FILES_PATH);
      } catch (e) {}
      return;
    }

    s3Client = getS3(configS3);
    isEnabled = true;
  };

  const getList = async ({
    cursor,
    limit = 10,
  }: {
    cursor?: string;
    limit?: number;
  } = {}) => {
    const { items, nextCursor } = await System.db.list<File>(
      { prefix: ["files"] },
      { cursor, limit },
    );

    return {
      files: items.map(({ value }) => value),
      nextCursor,
    };
  };

  const get = async (
    fileId: string,
  ): Promise<(File & { file: Uint8Array }) | null> => {
    const info = await System.db.get<File>(["files", fileId]);
    if (!info) return null;

    return {
      ...info,
      file: isEnabled
        ? await s3Client.getObject(fileId)
        : await Deno.readFile(join(FILES_PATH, fileId)),
    };
  };

  const set = async (file: File, buffer: Uint8Array) => {
    await System.db.set(["files", file.id], file);
    isEnabled
      ? await s3Client.addObject(file.id, buffer)
      : Deno.writeFile(join(FILES_PATH, file.id), buffer);
  };

  const remove = async (fileId: string) => {
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    isEnabled
      ? await s3Client.removeObjects([{ name: fileId }])
      : await Deno.remove(join(FILES_PATH, name));
    await System.db.delete(["files", fileId]);
  };

  return {
    load,

    getList,
    get,
    set,
    remove,
  };
};
