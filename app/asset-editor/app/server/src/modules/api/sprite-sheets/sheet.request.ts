import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import { getSearchParams } from "shared/utils/main.ts";

export const getSheetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/sheet",
  func: async (request, url) => {
    try {
      const id = getSearchParams(url).get("id")!;
      const data = await System.spriteSheets.getSheet(id);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
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

export const postSheetRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/sheet",
  func: async (request, url) => {
    try {
      const id = getSearchParams(url).get("id")!;
      await System.spriteSheets.updateSheet(id, await request.json());

      return Response.json({ status: 200 }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};

export const putSheetRequest: RequestType = {
  method: RequestMethod.PUT,
  pathname: "/sheet",
  func: async (request, url) => {
    try {
      const id = getSearchParams(url).get("id")!;

      const formData = await request.formData();
      for (const [, value] of formData.entries()) {
        await System.spriteSheets.updateRawSheet(id, value.stream());
        break;
      }

      return Response.json({ status: 200 }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};
