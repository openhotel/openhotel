import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import { getPathFromUrl } from "shared/utils/main.ts";

export const getMkDirRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/mk-dir",
  func: async (request, url) => {
    try {
      await System.data.mkdir(getPathFromUrl(url));
      return Response.json({ status: 200 }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};
