import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";

export const economyRequest: ProxyRequestType = {
  pathname: "/economy",
  method: RequestMethod.GET,
  func: async ({ user }) => {
    const credits = await user.getCredits();
    const transactions = await user.getTransactions();

    return {
      status: 200,
      data: {
        credits,
        transactions: transactions.sort((a, b) => b.timestamp - a.timestamp),
      },
    };
  },
};
