import { requestList } from "modules/api/main.ts";
import {
  getCORSHeaders,
  appendCORSHeaders,
  getResponse,
  HttpStatusCode,
  RequestMethod,
} from "@oh/utils";
import { System } from "system/main.ts";
import { REQUEST_KIND_COLOR_MAP } from "shared/consts/request.consts.ts";
import { RequestKind } from "shared/enums/request.enum.ts";

export const api = () => {
  const load = () => {
    const maxLength = Math.max(
      ...Object.values(RequestMethod).map((word: string) => word.length),
    );
    console.log();
    for (const request of requestList) {
      const kindList = (
        Array.isArray(request.kind) ? request.kind : [request.kind]
      ).map((kind) => `color: ${REQUEST_KIND_COLOR_MAP[kind]}`);

      console.log(
        ` %c${request.method.padStart(maxLength)} %c▓▓%c▓▓%c▓▓ %c${request.pathname}`,
        `font-weight: bold;color: white`,
        ...Object.assign(new Array(3).fill("color: white"), kindList),
        "color: white",
      );
    }
    console.log();

    for (const kind of Object.keys(REQUEST_KIND_COLOR_MAP)) {
      console.log(
        `%c▓▓ %c${RequestKind[kind]}`,
        `color: ${REQUEST_KIND_COLOR_MAP[kind]}`,
        "color: gray",
      );
    }
    console.log();

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

          if (parsedUrl.pathname.startsWith("/_")) {
            const fileId = parsedUrl.pathname.split("/_/")[1] ?? null;
            if (!fileId) return getResponse(HttpStatusCode.NOT_FOUND);

            const fileData = await System.files.get(fileId);
            if (!fileData) return getResponse(HttpStatusCode.NOT_FOUND);

            return new Response(fileData.file, {
              headers: {
                "Content-Type": fileData.mimeType || "application/octet-stream",
              },
            });
          }

          if (!parsedUrl.pathname.startsWith("/api")) {
            return new Response(
              await Deno.readTextFile(`./client/index.html`),
              {
                headers: {
                  "content-type": "text/html",
                },
              },
            );
          }

          const foundRequests = requestList.filter(
            ($request) => $request.pathname === parsedUrl.pathname,
          );
          const foundMethodRequest = foundRequests.find(
            ($request) => $request.method === method,
          );
          if (foundMethodRequest) {
            if (
              !(await checkAccess({
                request,
                kind: foundMethodRequest.kind ?? RequestKind.PUBLIC,
              }))
            )
              return getResponse(HttpStatusCode.FORBIDDEN);
            const response = await foundMethodRequest.func(request, parsedUrl);
            appendCORSHeaders(response.headers);
            return response;
          }
          if (foundRequests.length) return getResponse(HttpStatusCode.OK);
          return getResponse(HttpStatusCode.NOT_FOUND);
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
          return Boolean(data.admin);

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
