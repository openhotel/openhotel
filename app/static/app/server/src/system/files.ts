import { System } from "system/main.ts";
import { type File } from "shared/types/main.ts";
import { getS3, S3Mutable } from "@oh/utils";

export const files = () => {
  let s3Client: S3Mutable;

  const load = () => {
    const configS3 = System.getConfig().s3;
    s3Client = getS3(configS3);
  };

  const getList = async () =>
    (await System.db.list({ prefix: ["files"] })).map(({ value }) => value);

  const get = async (
    fileId: string,
  ): Promise<(File & { file: Uint8Array }) | null> => {
    const info = await System.db.get<File>(["files", fileId]);
    if (!info) return null;

    return {
      ...info,
      file: await s3Client.getObject(fileId),
    };
  };

  const set = async (file: File, buffer: Uint8Array) => {
    await System.db.set(["files", file.id], file);
    await s3Client.addObject(file.id, buffer);
  };

  const remove = async (fileId: string) => {
    await s3Client.removeObjects([{ name: fileId }]);
    await System.db.delete(["files", fileId]);
  };

  return {
    load,

    getList,
    set,
    remove,
  };
};
