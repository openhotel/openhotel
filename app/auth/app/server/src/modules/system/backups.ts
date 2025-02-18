import { System } from "modules/system/main.ts";
import { DELETE_BACKUP_PATH } from "shared/consts/backups.consts.ts";
import { walk } from "deno/fs/walk.ts";
import * as s3 from "s3/client";

export const backups = () => {
  let abortCronController: AbortController = new AbortController();

  const load = async () => {
    Deno.cron(
      "Backup auth",
      System.getConfig().backups.cron,
      { signal: abortCronController.signal },
      async () => {
        await backup("_cron");
        console.log("Backup ready!");
      },
    );
  };

  const stop = () => {
    abortCronController.abort();
  };

  const backup = async (name: string) => System.db.backup(name);

  const getList = async () => {
    const fileList = [];
    for await (const file of Deno.readDir(
      DELETE_BACKUP_PATH,
    ) as Deno.DirEntry[]) {
      const { size, mtime } = await Deno.stat(
        `${DELETE_BACKUP_PATH}/${file.name}`,
      );
      fileList.push({
        name: file.name,
        modifiedAt: Date.parse(mtime),
        //B kB
        size: Math.trunc(size * 0.001 * 100) / 100,
      });
    }
    return fileList;
  };

  const remove = async (name: string) => {
    try {
      await Deno.remove(`${DELETE_BACKUP_PATH}/${name}`);
    } catch (e) {}
  };

  const sync = async () => {
    const { endpoint, bucket, secretKey, accessKey, region } =
      System.getConfig().backups.s3;

    const s3Client = new s3.Client({
      endPoint: endpoint,
      useSSL: true,
      accessKey,
      secretKey,
      region,
    });

    const bucketExists = await s3Client.bucketExists(bucket);
    if (!bucketExists) s3Client.makeBucket(bucket);

    const files = walk(`${DELETE_BACKUP_PATH}`, {
      includeDirs: false,
    });

    for await (const entry of files) {
      if (entry.isFile) {
        try {
          await s3Client.fPutObject(bucket, entry.name, entry.path);
        } catch (e) {
          console.error("Error uploading to s3", e);
          return false;
        }
      }
    }

    return true;
  };

  return {
    stop,

    load,
    backup,

    remove,

    getList,

    sync,
  };
};
