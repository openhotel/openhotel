import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { getSearchParams } from "shared/utils/url.utils.ts";
import { compress } from "zip";
import { System } from "system/main.ts";
import { getContentType } from "shared/utils/content-type.utils.ts";

export const exportRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/export",
  func: async (request, url) => {
    try {
      const id = getSearchParams(url).get("id")!;

      await Deno.copyFile(`data/sprite-sheets/${id}/sheet.json`, "sheet.json");
      await Deno.copyFile(`data/sprite-sheets/${id}/sprite.png`, "sprite.png");
      await Deno.copyFile(`data/furniture/${id}/data.yml`, "data.yml");
      await Deno.copyFile(`data/furniture/${id}/lang.yml`, "lang.yml");

      const path = `/${id}.zip`;
      await compress(
        ["sprite.png", "sheet.json", "data.yml", "lang.yml"],
        `data${path}`,
        {
          overwrite: true,
        },
      );

      try {
        await Deno.remove("data.yml");
        await Deno.remove("lang.yml");
        await Deno.remove("sheet.json");
        await Deno.remove("sprite.png");
      } catch (e) {}

      const data = await System.data.readFile(path);

      const headers = new Headers();
      headers.append("Content-Type", getContentType(path));
      return new Response(data, {
        status: 200,
        headers,
      });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};
