import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";

export const marketplaceCancelRequest: ProxyRequestType = {
  pathname: "/cancel",
  method: RequestMethod.POST,
  func: async ({ user, data }) => {
    const { listingId } = data;

    if (!listingId) {
      return {
        status: 400,
        data: {
          error: "listingId is required",
        },
      };
    }

    const result = await System.game.marketplace.cancelListing(
      user.getAccountId(),
      listingId,
    );

    if (!result.success) {
      return {
        status: 400,
        data: {
          error: result.error,
        },
      };
    }

    return {
      status: 200,
      data: {
        success: true,
      },
    };
  },
};
