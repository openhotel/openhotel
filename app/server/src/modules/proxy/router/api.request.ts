import { ProxyEvent } from "shared/enums/main.ts";
import * as bcrypt from "@da/bcrypt";
import { getRandomString, getURL } from "@oh/utils";
import { Proxy } from "modules/proxy/main.ts";

export const getApiRequest = {
  method: "GET",
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

    if (!user)
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    let data = {};
    const { searchParams, pathname: currentPathname } = getURL(request.url);
    for (const [key, value] of searchParams as any) data[key] = value;

    const pathname = currentPathname.replace("/proxy", "").replace("/api", "");
    const eventName = user.accountId + getRandomString(8);

    try {
      return await new Promise<Response>((resolve) => {
        Proxy.getServerWorker().emit(ProxyEvent.$USER_API_DATA, {
          user,
          data,
          eventName,
          pathname,
          method,
          url: request.url,
        });

        Proxy.getServerWorker().on(eventName, ({ status, data }) => {
          resolve(Response.json({ status, data }, { status }));
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
