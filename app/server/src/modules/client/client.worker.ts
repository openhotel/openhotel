import { getContentType, initLog, log } from "shared/utils/main.ts";
import { getChildWorker } from "worker_ionic";
import { WorkerProps } from "shared/types/main.ts";

initLog();
const moduleWorker = getChildWorker();

moduleWorker.on("start", async ({ config }: WorkerProps) => {
  const ROOT_DIR_PATH = "/";

  log(`Client started on :${config.client.port}`);

  await Deno.serve({ port: config.client.port }, async (request: Request) => {
    const { url } = request;
    const { pathname } = new URL(url);

    if (!pathname.startsWith(ROOT_DIR_PATH)) {
      return new Response("404", { status: 404 });
    }
    const filePath = pathname.replace("/", "");
    const targetFile = "./client/" + (filePath || "index.html");

    try {
      let fileData = await Deno.readFile(targetFile);
      if (targetFile === "./client/index.html")
        fileData = (await Deno.readTextFile(targetFile)).replace(
          "/*__CONFIG__*/",
          `window.__config__ = ${JSON.stringify(config)}`,
        );
      return new Response(fileData, {
        headers: {
          "Content-Type": getContentType(targetFile),
        },
      });
    } catch (e) {}
    return new Response("404", { status: 404 });
  });
});
