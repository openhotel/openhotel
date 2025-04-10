import { requestList } from "modules/api/main.ts";
import {
  getCORSHeaders,
  getResponse,
  HttpStatusCode,
  RequestMethod,
  getApiHandler,
  RequestKind,
  getURL,
  getContentType,
} from "@oh/utils";
import { System } from "system/main.ts";
import { decodeTime } from "@std/ulid";

export const api = () => {
  const load = () => {
    const $apiHandler = getApiHandler({
      requests: requestList,
      checkAccess: checkAccess,
    });

    $apiHandler.overview();

    const { version, port } = System.getConfig();
    const isDevelopment = version === "development";

    Deno.serve(
      {
        port: port * (isDevelopment ? 10 : 1),
      },
      async ($request: Request, connInfo) => {
        const headers = new Headers($request.headers);
        headers.set("remote-address", connInfo.remoteAddr.hostname);
        const request = new Request($request, { headers });

        try {
          const { url, method } = request;
          if (method === RequestMethod.OPTIONS) {
            return new Response(null, {
              headers: getCORSHeaders(),
              status: 204,
            });
          }

          const parsedUrl = new URL(url);

          try {
            const fileId = parsedUrl.pathname.split("/")[1];

            if (decodeTime(fileId) > 0) {
              const fileData = await System.files.get(fileId);
              if (!fileData) return getResponse(HttpStatusCode.NOT_FOUND);

              return new Response(fileData.file, {
                headers: {
                  "Content-Type":
                    fileData.mimeType || "application/octet-stream",
                  "Content-Disposition": "inline",
                  "Cache-Control": `max-age=${60 * 60}`,
                },
              });
            }
          } catch (e) {}

          if (!parsedUrl.pathname.startsWith("/api")) {
            const { pathname } = getURL(url);

            const filePath = pathname.replace("/", "");
            const targetFile = "./client/" + (filePath || "index.html");

            let fileData = await Deno.readFile(targetFile);
            if (targetFile === "./client/index.html")
              fileData = await Deno.readTextFile(targetFile);
            return new Response(fileData, {
              headers: {
                "Content-Type": getContentType(targetFile),
              },
            });
          }

          return await $apiHandler.on(request);
        } catch (e) {
          console.log(e);
        }
        return getResponse(HttpStatusCode.INTERNAL_SERVER_ERROR);
      },
    );
  };

  const checkAccess = async ({
    request,
    kind,
  }: {
    request: Request;
    kind: RequestKind | RequestKind[];
  }): Promise<boolean> => {
    const check = async (kind: RequestKind) => {
      const accountId = request.headers.get("account-id");
      const accountToken = request.headers.get("account-token");

      if (!System.getConfig().auth.enabled) return true;

      switch (kind) {
        case RequestKind.PUBLIC:
          return true;
        case RequestKind.ACCOUNT:
          if (!accountId || !accountToken) return false;

          const accountData = await System.accounts.getData(request);
          return Boolean(accountData);

        case RequestKind.ADMIN:
          if (!accountId || !accountToken) return false;

          const data = await System.accounts.getData(request);
          return data && Boolean(data.admin);

        default:
          return false;
      }
    };

    return Array.isArray(kind)
      ? (await Promise.all(kind.map(check))).includes(true)
      : check(kind);
  };

  return {
    load,
  };
};
