import { getContentType, initLog, log } from "shared/utils/main.ts";
import { getChildWorker } from "worker_ionic";
import { WorkerProps } from "shared/types/main.ts";

initLog();
const moduleWorker = getChildWorker();

moduleWorker.on("start", async ({ config }: WorkerProps) => {
  const ROOT_DIR_PATH = "/";

  log(`Client started on :${config.ports.client}`);

  await Deno.serve({ port: config.ports.client }, async (request: Request) => {
    const { url } = request;
    const { pathname } = new URL(url);

    if (!pathname.startsWith(ROOT_DIR_PATH)) {
      return new Response("404", { status: 404 });
    }
    const filePath = pathname.replace("/", "");
    const targetFile = "./client/" + (filePath || "index.html");

    try {
      const fileBuffer = await Deno.readFile(targetFile);
      return new Response(fileBuffer, {
        headers: {
          "Content-Type": getContentType(targetFile),
        },
      });
    } catch (e) {}
    return new Response("404", { status: 404 });
  });
});
