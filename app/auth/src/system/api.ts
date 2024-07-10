import { requestList } from "modules/api/main.ts";
import { appendCORSHeaders } from "shared/utils/main.ts";

export const api = () => {
  const load = async () => {
    for (const request of requestList)
      console.info(request.method, request.pathname);

    await Deno.serve(
      { port: Deno.env.get("PORT") },
      async (request: Request) => {
        try {
          const { url, method } = request;
          const parsedUrl = new URL(url);

          const foundRequest = requestList.find(
            ($request) =>
              $request.method === method &&
              $request.pathname === parsedUrl.pathname,
          );
          if (foundRequest) {
            const response = await foundRequest.func(request, parsedUrl);
            appendCORSHeaders(response.headers);
            return response;
          }
        } catch (e) {}
        return new Response("404", { status: 404 });
      },
    );
  };

  return {
    load,
  };
};
