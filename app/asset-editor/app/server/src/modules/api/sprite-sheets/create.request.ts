import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import { getSearchParams } from "shared/utils/main.ts";

export const createRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/create",
  func: async (request, url) => {
    try {
      const id = getSearchParams(url).get("id")!;
      await System.spriteSheets.create(id);

      return Response.json({ status: 200 }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};
