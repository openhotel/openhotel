import { requestList } from "modules/api/main.ts";
import { appendCORSHeaders, getResponse, HttpStatusCode } from "@oh/utils";
import { System } from "system/main.ts";
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

          if (parsedUrl.pathname.startsWith("/_")) {
            const fileId = parsedUrl.pathname.split("/_/")[1] ?? null;
            if (!fileId) return getResponse(HttpStatusCode.NOT_FOUND);

            const fileData = await System.files.get(fileId, true);
            if (!fileData) return getResponse(HttpStatusCode.NOT_FOUND);

            return new Response(fileData.file, {
              headers: {
                "Content-Type": fileData.mimeType || "application/octet-stream",
              },
            });
          }

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
          return getResponse(HttpStatusCode.NOT_FOUND);
        } catch (e) {
          console.log(e);
        }
        return getResponse(HttpStatusCode.INTERNAL_SERVER_ERROR);
      },
    );
  };

  return {
    load,
  };
};
