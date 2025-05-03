import * as bcrypt from "@da/bcrypt";
import { getRandomString, getURL } from "@oh/utils";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const getApiRequest = {
  method: ["GET", "PUT", "POST", "DELETE"],
  pathname: "/api",
  fn: async (request: Request): Promise<Response> => {
    const { headers, method } = request;
    const accountId: string = headers.get("accountId");
    const token: string = headers.get("token");

    // envs.isDevelopment ? userList[0] :
    const user = Proxy.getUserList().find(
      (user) =>
        user.accountId === accountId &&
        bcrypt.compareSync(token, user.apiToken),
    );

    let data = {};
    const { searchParams } = getURL(request.url);
    for (const [key, value] of searchParams as any) data[key] = value;

    if (request.body) {
      try {
        data = {
          ...(await request.json()),
        };
      } catch (e) {}
    }

    const eventName = user?.accountId + getRandomString(32);

    try {
      return await new Promise<Response>((resolve) => {
        Proxy.getServerWorker().emit(ProxyEvent.$USER_API_DATA, {
          user,
          data,
          eventName,
          method,
          url: request.url.replace("/proxy", "").replace("/api", ""),
        });

        Proxy.getServerWorker().on(eventName, ({ status, data, headers }) => {
          resolve(
            headers
              ? new Response(data, {
                  status,
                  headers,
                })
              : Response.json({ status, data }, { status }),
          );
        });
      });
    } catch (e) {
      return Response.json(
        {
          status: 500,
        },
        { status: 500 },
      );
    }
  },
};
