import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";

export const getConfigRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/config",
  func: () => {
    const { client, auth } = System.getConfig();

    return Response.json(
      {
        status: 200,
        data: {
          client: {
            url: client.url,
          },
          auth: {
            url: auth.url,
          },
        },
      },
      { status: 200 },
    );
  },
};
