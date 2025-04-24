import { ProxyRequestType } from "shared/types/api.types.ts";
import { RequestMethod } from "@oh/utils";
import { TransactionType } from "shared/enums/economy.enum.ts";
import { log } from "shared/utils/log.utils.ts";

export const economyRequest: ProxyRequestType = {
  pathname: "/economy",
  method: RequestMethod.GET,
  func: async ({ user }) => {
    const credits = await user.getCredits();
    const transactions = await user.getTransactions();

    log("userId", user.getAccountId());

    const demo = [
      {
        id: "1a",
        type: TransactionType.PURCHASE,
        amount: 10,
        fromAccount: "0",
        toAccount: "hotel",
        timestamp: Date.now(),
      },
      {
        id: "sofa",
        type: TransactionType.PURCHASE,
        amount: 3,
        fromAccount: "0",
        toAccount: "hotel",
        timestamp: Date.now(),
      },
      {
        id: "2b",
        type: TransactionType.REWARD,
        amount: 10,
        fromAccount: "hotel",
        toAccount: user.getAccountId(),
        timestamp: Date.now(),
      },
    ];
    return {
      status: 200,
      data: {
        credits,
        transactions: transactions ?? demo,
      },
    };
    // }
  },
};
