import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { TransactionType } from "shared/enums/economy.enum.ts";
import { Transaction } from "shared/types/economy.types.ts";
import { log } from "shared/utils/log.utils.ts";

export const economyRequest: ProxyRequestType = {
  pathname: "/economy",
  method: RequestMethod.GET,
  func: async ({ user }) => {
    const credits = await user.getCredits();
    const transactions = await user.getTransactions();

    log("userId", user.getAccountId());

    const demo: Transaction[] = [
      {
        id: "01JT1K807MS6ES2AG7Y81Y56DY",
        description: "alpha@p-24",
        type: TransactionType.PURCHASE,
        amount: 30,
        fromAccount: user.getAccountId(),
        toAccount: "hotel",
        timestamp: Date.now(),
      },
      {
        id: "01JT1K84ZBQT0MGSG1G5VEAD8R",
        description: "alpha@a-24",
        type: TransactionType.PURCHASE,
        amount: 29,
        fromAccount: user.getAccountId(),
        toAccount: "hotel",
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: "01JT1K87WGDERA7SPW1A8CR92X",
        description: "Furni Wars",
        type: TransactionType.REWARD,
        amount: 95,
        fromAccount: "hotel",
        toAccount: user.getAccountId(),
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
      },
    ];
    return {
      status: 200,
      data: {
        credits,
        transactions: transactions ?? demo,
      },
    };
  },
};
