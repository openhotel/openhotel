import { getContentType, initLog, log } from "shared/utils/main.ts";
import { getChildWorker } from "worker_ionic";
import { WorkerProps } from "shared/types/main.ts";

const moduleWorker = getChildWorker();

moduleWorker.on("start", async ({ config, envs }: WorkerProps) => {
  initLog(envs);
  const ROOT_DIR_PATH = "/";

  log(`Client started on :${config.client.port}`);

  const getFurnitureResponse = async (pathname: string) => {
    try {
      pathname = pathname.substring(5);
      const fileData = await Deno.readFile("./assets/furniture" + pathname);

      return new Response(fileData, {
        headers: {
          "Content-Type": getContentType(pathname),
        },
      });
    } catch (e) {}
    return new Response("404", { status: 404 });
  };

  await Deno.serve(
    { port: config.client.port * (envs.isDevelopment ? 10 : 1) },
    async (request: Request) => {
      try {
        const { url } = request;
        const { pathname } = new URL(url);

        if (!pathname.startsWith(ROOT_DIR_PATH)) {
          return new Response("404", { status: 404 });
        }
        if (pathname.startsWith("/data"))
          return await getFurnitureResponse(pathname);

        const filePath = pathname.replace("/", "");
        const targetFile = "./client/" + (filePath || "index.html");

        let fileData = await Deno.readFile(targetFile);
        if (targetFile === "./client/index.html")
          fileData = (await Deno.readTextFile(targetFile)).replace(
            /{\s*\/\*__CONFIG__\*\/\s*}/,
            JSON.stringify(config),
          );
        return new Response(fileData, {
          headers: {
            "Content-Type": getContentType(targetFile),
          },
        });
      } catch (e) {}
      return new Response("404", { status: 404 });
    },
  );
});
