import {
  appendCORSHeaders,
  getContentType,
  getCORSHeaders,
  getResponse,
  HttpStatusCode,
  RequestMethod,
} from "@oh/utils";
import { System } from "./main.ts";
import { requestV3List } from "modules/api/v3/main.ts";
import { REQUEST_KIND_COLOR_MAP } from "shared/consts/request.consts.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { AccountMutable } from "shared/types/account.types.ts";

export const api = () => {
  const load = (testMode: boolean = false) => {
    if (!testMode) {
      const maxLength = Math.max(
        ...Object.values(RequestMethod).map((word: string) => word.length),
      );
      console.log();
      for (const request of requestV3List) {
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
    } else {
      console.log(" >>>>>>>>>>>>>>>   TEST MODE   <<<<<<<<<<<<<<<<<");
      console.log(" >>>>>>>>>>>>>>> Server ready! <<<<<<<<<<<<<<<<<");
    }

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

          if (!parsedUrl.pathname.startsWith("/api")) {
            try {
              const fileData = await Deno.readFile(
                "./client" + parsedUrl.pathname,
              );

              return new Response(fileData, {
                headers: {
                  "Content-Type": getContentType(parsedUrl.pathname),
                },
              });
            } catch (e) {
              return new Response(
                await Deno.readTextFile(`./client/index.html`),
                {
                  headers: {
                    "content-type": "text/html",
                  },
                },
              );
            }
          }

          const foundRequests = requestV3List.filter(
            ($request) =>
              // $request.method === method &&
              $request.pathname === parsedUrl.pathname,
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
      const licenseToken = request.headers.get("license-token");
      let account: AccountMutable;

      switch (kind) {
        case RequestKind.PUBLIC:
          return true;
        case RequestKind.ACCOUNT_REFRESH:
          if (!accountId) return false;

          account = await System.accounts.getAccount({ accountId });
          if (!account) return false;

          return await account.checkRefreshToken(request);
        case RequestKind.ACCOUNT:
          if (!accountId) return false;

          account = await System.accounts.getAccount({ accountId });
          if (!account) return false;

          return await account.checkToken(request);
        case RequestKind.LICENSE:
          if (!licenseToken) return false;

          const licenseHotel = await System.hotels.getHotel({ licenseToken });
          return Boolean(licenseHotel);
        case RequestKind.CONNECTION:
          if (!licenseToken) return false;

          const hotel = await System.hotels.getHotel({ licenseToken });
          if (!hotel) return false;

          account = await System.accounts.getAccount({ request });
          if (!account) return false;

          const connection = await account.connections.active.get();
          if (!connection) return false;

          const hotelData = hotel.getObject();
          if (hotelData.hotelId !== connection.hotelId) return false;

          const hotelIntegration = hotel.integrations.getIntegration(
            connection.integrationId,
          );
          return Boolean(hotelIntegration);
        case RequestKind.ADMIN:
          if (!accountId) return false;

          account = await System.accounts.getAccount({ accountId });
          if (!account || !(await account.checkToken(request))) return false;

          return await account.isAdmin();
        case RequestKind.TOKEN:
          const appToken = request.headers.get("app-token");
          return appToken && (await System.tokens.verify(appToken));
        case RequestKind.APPS:
          const $appToken = request.headers.get("app-token");
          return $appToken && (await System.apps.verify($appToken));
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
