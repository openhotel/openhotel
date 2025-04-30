import { RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { TransactionType } from "shared/enums/economy.enum.ts";

export const catalogBuyRequest: ProxyRequestType = {
  pathname: "/buy",
  method: RequestMethod.POST,
  func: async ({ user, data }) => {
    const { furnitureId } = data;

    const furniture = await System.game.furniture.get(furnitureId);
    if (!furniture) {
      return {
        status: 404,
        error: "Furniture not found",
      };
    }

    // TODO: https://github.com/openhotel/openhotel/issues/819
    // @ts-ignore
    const price = furniture?.price ?? 10;
    const transaction = await System.game.economy.executeTransaction({
      type: TransactionType.PURCHASE,
      description: `Buy ${furniture.id}`,
      amount: price,
      fromAccount: user.getAccountId(),
      toAccount: "hotel",
      meta: {
        furnitureId,
      },
    });

    if (!transaction) {
      return {
        status: 500,
        data: {
          error: "Transaction failed",
        },
      };
    }

    if (!transaction.success) {
      return {
        status: 402,
        data: {
          error: transaction.error,
        },
      };
    }

    return {
      status: 200,
      data: {
        transaction,
      },
    };
  },
};
