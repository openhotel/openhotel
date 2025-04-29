import { getContentType, getURL } from "@oh/utils";

export const requestClient = async (request: Request) => {
  const ROOT_DIR_PATH = "/";

  try {
    const { url } = request;
    const { pathname } = getURL(url);

    if (!pathname.startsWith(ROOT_DIR_PATH)) {
      return new Response("404", { status: 404 });
    }

    const filePath = pathname.replace("/", "");
    const targetFile = "./client/" + (filePath || "index.html");

    let fileData = await Deno.readFile(targetFile);
    if (targetFile === "./client/index.html")
      fileData = await Deno.readTextFile(targetFile);
    return new Response(fileData, {
      headers: {
        "Content-Type": getContentType(targetFile),
      },
    });
  } catch (e) {}
};
