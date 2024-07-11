import { requestV1List } from "modules/api/v1/main.ts";
import { appendCORSHeaders } from "shared/utils/main.ts";
import { System } from "system/main.ts";

export const api = () => {
  const load = () => {
    for (const request of requestV1List)
      console.info(request.method, request.pathname);

    Deno.serve(
      { port: System.getConfig().port },
      async (request: Request) => {
        try {
          const { url, method } = request;
          const parsedUrl = new URL(url);

          const foundRequest = requestV1List.find(
            ($request) =>
              $request.method === method &&
              $request.pathname === parsedUrl.pathname,
          );
          if (foundRequest) {
            const response = await foundRequest.func(request, parsedUrl);
            appendCORSHeaders(response.headers);
            return response;
          }
        } catch (e) {
          console.log(e);
        }
        return new Response("404", { status: 404 });
      },
    );
  };

  return {
    load,
  };
};
