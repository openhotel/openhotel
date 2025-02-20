import { System } from "system/main.ts";
import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";

export const deleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  func: async (request) => {
    const { id } = await request.json();
    if (!id) {
      return getResponse(HttpStatusCode.BAD_REQUEST);
    }

    const file = await System.files.get(id);
    if (!file) {
      return getResponse(HttpStatusCode.NOT_FOUND);
    }

    await System.files.remove(id);

    return getResponse(HttpStatusCode.OK);
  },
};
