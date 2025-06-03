import { getContentType, getURL } from "@oh/utils";
import { Proxy } from "modules/proxy/main.ts";

export const requestGame = async (request: Request) => {
  const ROOT_DIR_PATH = "/game/";

  try {
    const { url } = request;
    const { pathname } = getURL(url);
    const $pathname = pathname.replace("/proxy", "");

    if (!$pathname.startsWith(ROOT_DIR_PATH)) return null;

    if (Proxy.getEnvs().version === "development")
      return new Response(null, {
        status: 302,
        headers: {
          Location: "http://localhost:2994",
        },
      });

    const filePath = $pathname.replace(ROOT_DIR_PATH, "");
    const targetFile =
      "./assets/games/" +
      filePath +
      (filePath.endsWith("/") ? "index.html" : "");
    console.log(targetFile);

    let fileData = await Deno.readFile(targetFile);
    if (targetFile.endsWith("index.html"))
      fileData = await Deno.readTextFile(targetFile);
    return new Response(fileData, {
      headers: {
        "Content-Type": getContentType(targetFile),
      },
    });
  } catch (e) {}
};
