import { waitUntil } from "../src/shared/utils/wait.utils.ts";
import { fetcher } from "./utils.ts";

const isDevelopmentMode = Deno.args.includes("--development");

const deleteDatabase = async () => {
  try {
    Deno.removeSync("../deleteme-database");
  } catch (e) {}
  try {
    Deno.removeSync("../deleteme-database-shm");
  } catch (e) {}
  try {
    Deno.removeSync("../deleteme-database-wal");
  } catch (e) {}
};
await deleteDatabase();

let serverProcess;
if (!isDevelopmentMode) {
  Deno.writeTextFileSync(
    "../.env",
    `DB_SECRET_KEY=DB_SECRET_KEY\nDISCORD_WEBHOOK=DISCORD_WEBHOOK`,
  );

  let serverCommand = new Deno.Command(Deno.execPath(), {
    args: ["task", "start:nowatch", "--testMode"],
    cwd: "../",
  });
  serverProcess = serverCommand.spawn();
}

await waitUntil(
  async () => {
    try {
      await fetcher("/version");
      return true;
    } catch (e) {
      return false;
    }
  },
  1000,
  120,
);

const commandTest = new Deno.Command(Deno.execPath(), {
  args: ["test", "-A"],
  cwd: "./",
});
const testsProcess = commandTest.spawn();

const response = await testsProcess.status;

if (serverProcess) Deno.kill(serverProcess.pid);

if (!response.success) throw "Error with tests!";
