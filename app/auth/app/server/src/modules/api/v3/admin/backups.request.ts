import {
  RequestType,
  RequestMethod,
  update,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const backupsGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/backups",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const backups = await System.backups.getList();

    return getResponse(HttpStatusCode.OK, { data: { backups } });
  },
};

export const backupsPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/backups",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { name } = await request.json();
    console.log(name);
    await System.backups.backup(name);

    return getResponse(HttpStatusCode.OK);
  },
};

export const backupsDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/backups",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { name } = await request.json();

    await System.backups.remove(name);

    return getResponse(HttpStatusCode.OK);
  },
};
