import { parse } from "@std/yaml";
import { getContentType, getURL } from "@oh/utils";

export const requestGame = async (request: Request) => {
  const ROOT_DIR_PATH = "/game/";

  try {
    const { url } = request;
    const { pathname } = getURL(url);
    const $pathname = pathname.replace("/proxy", "");

    if (!$pathname.startsWith(ROOT_DIR_PATH)) return null;

    const gameId = $pathname.replace("/game/", "").split("/")[0];
    const actualPathName = $pathname.replace(`/game/${gameId}/`, "");

    const games = parse(await Deno.readTextFile(".games/games.yml"));

    const gamePath = games[gameId].name;
    if (!gamePath)
      return new Response(null, {
        status: 404,
      });

    const targetFile =
      ".games/" + gamePath + "/client/" + (actualPathName || "index.html");

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
