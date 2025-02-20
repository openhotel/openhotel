import { System } from "modules/system/main.ts";

export const backups = () => {
  let abortCronController: AbortController = new AbortController();

  const load = async () => {
    Deno.cron(
      "Backup auth",
      System.getConfig().backups.cron,
      { signal: abortCronController.signal },
      async () => {
        await System.db.backup("_cron");
        console.log("Backup ready!");
      },
    );
  };

  const stop = () => {
    abortCronController.abort();
  };

  return {
    stop,

    load,
  };
};
