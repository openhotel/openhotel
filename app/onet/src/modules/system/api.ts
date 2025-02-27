import { requestV1List } from "modules/api/v1/main.ts";
import {
  getCORSHeaders,
  RequestMethod,
  getApiHandler,
  ApiHandlerMutable,
  RequestKind,
} from "@oh/utils";
import { System } from "./main.ts";

export const api = () => {
  let $apiHandler: ApiHandlerMutable;

  const load = () => {
    $apiHandler = getApiHandler({
      requests: requestV1List,
      checkAccess,
    });

    $apiHandler.overview();
  };

  const onRequest = async (
    $request: Request,
    connInfo: Deno.ServeHandlerInfo,
  ): Promise<Response> => {
    const headers = new Headers($request.headers);
    //@ts-ignore
    headers.set("remote-address", connInfo.remoteAddr.hostname);
    const request = new Request($request, { headers });

    try {
      const { method } = request;
      if (method === RequestMethod.OPTIONS)
        return new Response(null, {
          headers: getCORSHeaders(),
          status: 204,
        });

      return await $apiHandler.on(request);
    } catch (e) {
      console.log(e);
    }
    return new Response("500", { status: 500 });
  };

  const checkAccess = async ({
    request,
    kind,
  }: {
    request: Request;
    kind: RequestKind | RequestKind[];
  }): Promise<boolean> => {
    const check = async (kind: RequestKind) => {
      switch (kind) {
        case RequestKind.PUBLIC:
          return true;
        case RequestKind.TOKEN:
          const hotelId = request.headers.get("hotel-id");
          const token = request.headers.get("token");

          if (!hotelId || !token) return false;

          const hotel = System.hotels.get({ hotelId });
          return hotel.verify(token);
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
    onRequest,
  };
};
