import { ApiRequestProps } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { getRandomString } from "shared/utils/main.ts";
import * as bcrypt from "bcrypt";

export const getApiRequest = {
  method: "GET",
  pathname: "/api",
  fn: async ({
    request,
    serverWorker,
    userList,
  }: ApiRequestProps): Promise<Response> => {
    const { headers, method } = request;
    const accountId: string = headers.get("accountId");
    const token: string = headers.get("token");

    // envs.isDevelopment ? userList[0] :
    const user = userList.find(
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
    const { searchParams, pathname: currentPathname } = new URL(request.url);
    for (const [key, value] of searchParams as any) data[key] = value;

    const pathname = currentPathname.replace("/proxy", "").replace("/api", "");
    const eventName = user.accountId + getRandomString(8);

    try {
      return await new Promise<Response>((resolve) => {
        serverWorker.emit(ProxyEvent.$USER_API_DATA, {
          user,
          data,
          eventName,
          pathname,
          method,
        });

        serverWorker.on(eventName, ({ status, data }) => {
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
