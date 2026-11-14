import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const backupGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/backup",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    const name = url.searchParams.get("name");

    const backupFile = await System.db.getBackupFile(name);

    return new Response(backupFile, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="backup.zip"',
      },
    });
  },
};

export const backupPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/backup",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { name } = await request.json();

    await System.db.backup(name);

    return getResponse(HttpStatusCode.OK);
  },
};

export const backupDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/backup",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { name } = await request.json();

    await System.db.removeBackup(name);

    return getResponse(HttpStatusCode.OK);
  },
};

export const backupsGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/backups",
  kind: RequestKind.ADMIN,
  func: async () => {
    const backups = await System.db.getBackups();

    return getResponse(HttpStatusCode.OK, { data: { backups } });
  },
};
