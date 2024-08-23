import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";

export const listRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/list",
  func: async (request, url) => {
    try {
      const list = await System.spriteSheets.getList();
      return Response.json({ status: 200, data: { list } }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};
