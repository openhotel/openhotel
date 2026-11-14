import { RequestMethod } from "../enums/request.enum.ts";
import {
  RequestKind,
  type ApiHandlerProps,
  type ApiHandlerMutable,
} from "../types/request.types.ts";
import { REQUEST_KIND_COLOR_MAP } from "../consts/request.consts.ts";
import { getResponse } from "../utils/response.utils.ts";
import { HttpStatusCode } from "../enums/http-status-code.enums.ts";
import { appendCORSHeaders, getCORSHeaders } from "../utils/cors.utils.ts";

export const getApiHandler = <RequestKindT extends number = RequestKind>({
  requests,
  checkAccess,
  testMode = false,
  requestKindEnum = RequestKind as unknown as Record<RequestKindT, string>,
  requestKindColorMap = REQUEST_KIND_COLOR_MAP,
}: ApiHandlerProps<RequestKindT>): ApiHandlerMutable => {
  const overview = () => {
    if (!testMode) {
      const maxLength = Math.max(
        ...Object.values(RequestMethod).map((word: string) => word.length),
      );
      console.log();
      for (const request of requests) {
        const kindList = (
          Array.isArray(request.kind) ? request.kind : [request.kind]
        ).map((kind) => `color: ${requestKindColorMap[Number(kind)]}`);

        console.log(
          ` %c${request.method.padStart(maxLength)} %c▓▓%c▓▓%c▓▓ %c${request.pathname}`,
          `font-weight: bold;color: white`,
          ...Object.assign(new Array(3).fill("color: white"), kindList),
          "color: white",
        );
      }
      console.log();

      for (const kind of Object.keys(requestKindColorMap)) {
        const kindNumber = Number(kind);

        console.log(
          `%c▓▓ %c${requestKindEnum[kindNumber]}`,
          `color: ${requestKindColorMap[kindNumber]}`,
          "color: gray",
        );
      }
      console.log();
    } else {
      console.log(" >>>>>>>>>>>>>>>   TEST MODE   <<<<<<<<<<<<<<<<<");
      console.log(" >>>>>>>>>>>>>>> Server ready! <<<<<<<<<<<<<<<<<");
    }
  };

  const on = async (request: Request) => {
    const { url, method } = request;
    const parsedUrl = new URL(url);

    const foundRequests = requests.filter(
      ($request) => $request.pathname === parsedUrl.pathname,
    );
    const foundMethodRequest = foundRequests.find(
      ($request) => $request.method === method,
    );

    if (foundMethodRequest) {
      if (
        checkAccess &&
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

    //CORS
    if (foundRequests.length && method === RequestMethod.OPTIONS) {
      return new Response(null, {
        headers: getCORSHeaders(),
        status: 204,
      });
    }
    return getResponse(HttpStatusCode.NOT_FOUND);
  };

  return {
    overview,
    on,
  };
};
