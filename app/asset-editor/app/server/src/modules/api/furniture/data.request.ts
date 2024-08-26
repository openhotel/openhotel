import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import { getSearchParams } from "shared/utils/main.ts";

export const getDataRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/data",
  func: async (request, url) => {
    try {
      const id = getSearchParams(url).get("id")!;
      const data = await System.furniture.getData(id);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      return new Response(JSON.stringify(data), {
        status: 200,
        headers,
      });
    } catch (e) {
      return new Response("", { status: 500 });
    }
  },
};

export const postDataRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/data",
  func: async (request, url) => {
    try {
      const id = getSearchParams(url).get("id")!;
      await System.furniture.updateData(id, await request.json());

      return Response.json({ status: 200 }, { status: 200 });
    } catch (e) {
      console.error(e);
      return new Response("", { status: 500 });
    }
  },
};
