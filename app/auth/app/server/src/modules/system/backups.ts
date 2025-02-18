import { System } from "modules/system/main.ts";
import { DELETE_BACKUP_PATH } from "shared/consts/backups.consts.ts";

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

  return {
    stop,

    load,
    backup,

    remove,

    getList,
  };
};
