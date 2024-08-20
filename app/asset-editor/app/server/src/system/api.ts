import { requestList } from "modules/api/main.ts";
import { appendCORSHeaders } from "shared/utils/main.ts";
import { System } from "system/main.ts";
import { clientIndex } from "../../client-index.ts";
import { isDevelopment } from "shared/utils/environment.utils.ts";

export const api = () => {
  const load = () => {
    for (const request of requestList)
      console.info(request.method, request.pathname);

    Deno.serve(
      {
        port: System.getConfig().port * (isDevelopment() ? 10 : 1),
      },
      async (request: Request) => {
        try {
          const { url, method } = request;
          const parsedUrl = new URL(url);

          if (!parsedUrl.pathname.startsWith("/api")) {
            return new Response(decodeURIComponent(clientIndex), {
              headers: {
                "Content-Type": "text/html",
              },
            });
          }

          const foundRequests = requestList.filter(
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
            });
          return new Response("404", { status: 404 });
        } catch (e) {
          console.log(e);
        }
        return new Response("500", { status: 500 });
      },
    );
  };

  return {
    load,
  };
};
