import { requestV2List } from "modules/api/v2/main.ts";
import { getContentType } from "shared/utils/main.ts";
import { System } from "system/main.ts";

export const api = () => {
  const load = () => {
    for (const request of requestV2List)
      console.info(request.method, request.pathname);

    Deno.serve(
      {
        port:
          System.getConfig().port * (System.getEnvs().isDevelopment ? 10 : 1),
      },
      async (request: Request) => {
        try {
          const { url, method } = request;
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
                    "Content-Type": "text/html",
                  },
                },
              );
            }
          }

          const foundRequests = requestV2List.filter(
            ($request) =>
              // $request.method === method &&
              $request.pathname === parsedUrl.pathname,
          );
          const foundMethodRequest = foundRequests.find(
            ($request) => $request.method === method,
          );
          if (foundMethodRequest) {
            const response = await foundMethodRequest.func(request, parsedUrl);
            // appendCORSHeaders(response.headers);
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
