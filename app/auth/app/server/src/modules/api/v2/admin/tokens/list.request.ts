import { RequestType, RequestMethod } from "@oh/utils";
import { isAccountAdminValid } from "shared/utils/account.utils.ts";
import { Service } from "shared/enums/services.enums.ts";

export const getListRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/list",
  func: async (request) => {
    const status = await isAccountAdminValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );

    return Response.json(
      {
        status: 200,
        data: {
          list: Object.values(Service)
            .filter((value) => typeof value === "string")
            .map((value: string) => value.toLowerCase()),
        },
      },
      {
        status: 200,
      },
    );
  },
};
