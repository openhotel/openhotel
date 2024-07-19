import { requestV1List } from "modules/api/v1/main.ts";
import { appendCORSHeaders, getCORSHeaders } from "shared/utils/main.ts";
import { System } from "system/main.ts";

export const api = () => {
  const load = () => {
    for (const request of requestV1List)
      console.info(request.method, request.pathname);

    Deno.serve({ port: System.getConfig().port }, async (request: Request) => {
      try {
        const { url, method } = request;
        const parsedUrl = new URL(url);

        const foundRequests = requestV1List.filter(
          ($request) =>
            // $request.method === method &&
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
            headers: getCORSHeaders(),
          });
      } catch (e) {
        console.log(e);
      }
      return new Response("404", { status: 404 });
    });
  };

  return {
    load,
  };
};
