import { requestList } from "modules/api/main.ts";
import { System } from "system/main.ts";
import { decodeTime } from "@std/ulid";
import { getApiHandler } from "@shared/modules/old/api.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { appendCORSHeaders, getCORSHeaders } from "@shared/utils/cors.utils.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";
import { getURL } from "@shared/utils/urls.utils.ts";
import { getContentType } from "@shared/utils/content-type.utils.ts";

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

              const headers = new Headers();
              headers.set(
                "Content-Type",
                fileData.mimeType || "application/octet-stream",
              );
              headers.set("Content-Disposition", "inline");
              headers.set("Cache-Control", `max-age=${60 * 60}`);
              appendCORSHeaders(headers);

              return new Response(fileData.file, {
                headers,
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
