import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { getPathFromUrl } from "shared/utils/main.ts";
import { System } from "system/main.ts";

export const getReadDirRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/read-dir",
  func: async (request, url) => {
    try {
      const list = await System.data.readDir(getPathFromUrl(url));
      return Response.json({ status: 200, data: { list } }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};
