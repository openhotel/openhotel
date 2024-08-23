import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { getContentType, getPathFromUrl } from "shared/utils/main.ts";
import { System } from "system/main.ts";

export const getReadFileRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/read-file",
  func: async (request, url) => {
    try {
      const path = getPathFromUrl(url);
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
