import { waitUntil } from "../src/shared/utils/wait.utils.ts";
import { fetcher } from "./utils.ts";

Deno.writeTextFileSync("../.env", `DB_SECRET_KEY=DB_SECRET_KEY`);

const serverCommand = new Deno.Command(Deno.execPath(), {
  args: ["task", "start", "--testMode"],
  cwd: "../",
});
const serverProcess = serverCommand.spawn();

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

Deno.kill(serverProcess.pid);
if (!response.success) throw "Error with tests!";
