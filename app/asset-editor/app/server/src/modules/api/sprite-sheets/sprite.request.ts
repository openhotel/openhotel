import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import { getSearchParams } from "shared/utils/main.ts";

export const getSpriteRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/sprite",
  func: async (request, url) => {
    try {
      const id = getSearchParams(url).get("id")!;
      const data = await System.spriteSheets.getSprite(id);

      const headers = new Headers();
      headers.append("Content-Type", "image/png");
      return new Response(data, {
        status: 200,
        headers,
      });
    } catch (e) {
      console.error(e);
      return new Response("", {
        status: 500,
      });
    }
  },
};

export const postSpriteRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/sprite",
  func: async (request, url) => {
    try {
      const id = getSearchParams(url).get("id")!;

      const formData = await request.formData();
      for (const [, value] of formData.entries()) {
        await System.spriteSheets.updateRawSprite(id, value.stream());
        break;
      }

      return Response.json({ status: 200 }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};
