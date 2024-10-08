import { requestV1List } from "modules/api/v1/main.ts";
import { appendCORSHeaders, getCORSHeaders, RequestMethod } from "@oh/utils";

export const api = () => {
  const load = () => {
    for (const request of requestV1List)
      console.info(request.method, request.pathname);
  };

  const onRequest = async (
    $request: Request,
    connInfo: Deno.ServeHandlerInfo,
  ): Promise<Response> => {
    const headers = new Headers($request.headers);
    headers.set("remote-address", connInfo.remoteAddr.hostname);
    const request = new Request($request, { headers });

    try {
      const { url, method } = request;
      if (method === RequestMethod.OPTIONS)
        return new Response(null, {
          headers: getCORSHeaders(),
          status: 204,
        });

      const parsedUrl = new URL(url);

      const foundRequests = requestV1List.filter(
        ($request) =>
          $request.method === method &&
          $request.pathname === parsedUrl.pathname,
      );
      const foundMethodRequest = foundRequests.find(
        ($request) => $request.method === method,
      );
      if (foundMethodRequest) {
        const response = await foundMethodRequest.func(request, parsedUrl);
        appendCORSHeaders(response.headers);
        return response;
      }
      if (foundRequests.length)
        return new Response("200", {
          status: 200,
        });
      return new Response("404", { status: 404 });
    } catch (e) {
      console.log(e);
    }
    return new Response("500", { status: 500 });
  };

  return {
    load,
    onRequest,
  };
};
