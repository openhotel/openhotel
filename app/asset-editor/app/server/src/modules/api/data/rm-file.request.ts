import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { getPathFromUrl } from "shared/utils/main.ts";
import { System } from "system/main.ts";

export const getRmFileRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/rm-file",
  func: async (request, url) => {
    try {
      const path = getPathFromUrl(url);
      await System.data.remove(path);

      return Response.json({ status: 200 }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};
