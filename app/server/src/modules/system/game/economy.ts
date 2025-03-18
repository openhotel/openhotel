import { log } from "shared/utils/log.utils.ts";
import { System } from "../main.ts";
import { ulid } from "@std/ulid";
import { TransactionType } from "shared/enums/economy.enum.ts";
import { TransactionParams } from "shared/types/economy.types.ts";

export const economy = () => {
  const load = async () => {
    log("> Loading economy...");
    log("> Economy loaded!");
  };

  const getHotelBalance = async (): Promise<number> => {
    return await System.db.get(["hotel", "balance"]);
  };

  const executeTransaction = async (params: TransactionParams) => {
    const { type, amount, fromAccount, toAccount, meta } = params;

    if (amount <= 0) {
      throw new Error("The amount must be greater than zero.");
    }

    const atomic = System.db.atomic();

    try {
      switch (type) {
        case TransactionType.REWARD:
        case TransactionType.REFUND:
          // Flow: Hotel -> User
          if (!toAccount) {
            throw new Error(
              "toAccount is required for reward/refund transactions.",
            );
          }

          atomic
            .check({
              key: ["hotel", "balance"],
              value: (balance: number) => balance >= amount,
            })
            .check({
              key: ["users", toAccount, "balance"],
              value: (balance: number) => balance !== undefined,
            })
            .mutate({
              key: ["hotel", "balance"],
              value: (balance: number) => balance - amount,
            })
            .mutate({
              key: ["users", toAccount, "balance"],
              value: (balance: number) => (balance || 0) + amount,
            });
          break;

        case TransactionType.PURCHASE:
          // Flow: User -> Hotel
          if (!fromAccount) {
            throw new Error(
              "fromAccount is required for purchase transactions.",
            );
          }

          atomic
            .check({
              key: ["users", fromAccount, "balance"],
              value: (balance: number) => balance >= amount,
            })
            .check({
              key: ["hotel", "balance"],
              value: (balance: number) => balance !== undefined,
            })
            .mutate({
              key: ["users", fromAccount, "balance"],
              value: (balance: number) => balance - amount,
            })
            .mutate({
              key: ["hotel", "balance"],
              value: (balance: number) => (balance || 0) + amount,
            });
          break;

        case TransactionType.DEPOSIT:
          // Flow: onet -> User (onet coin -> local coin)
          // TODO: onet
          break;

        case TransactionType.WITHDRAWAL:
          // TODO: onet
          // Flow: User -> onet (local coin -> onet coin)
          break;

        case TransactionType.TRANSFER:
          // Flow: User -> User
          if (!fromAccount || !toAccount) {
            throw new Error(
              "fromAccount and toAccount are required for transfer transactions.",
            );
          }

          atomic
            .check({
              key: ["users", fromAccount, "balance"],
              value: (balance: number) => balance >= amount,
            })
            .mutate({
              key: ["users", fromAccount, "balance"],
              value: (balance: number) => balance - amount,
            })
            .mutate({
              key: ["users", toAccount, "balance"],
              value: (balance: number) => (balance || 0) + amount,
            });
          break;

        default:
          throw new Error("Unsupported transaction type");
      }

      atomic.commit();

      const transactionId = ulid();
      const transactionData = {
        type,
        fromAccount: fromAccount || null,
        toAccount: toAccount || null,
        amount,
        timestamp: Date.now(),
        meta,
      };

      await System.db.set(["transactions", transactionId], transactionData);

      if (fromAccount) {
        await System.db.set(
          ["transactionsByUser", fromAccount, transactionId],
          {
            ...transactionData,
            amount: -amount,
          },
        );
      }

      if (toAccount) {
        await System.db.set(
          ["transactionsByUser", toAccount, transactionId],
          transactionData,
        );
      }

      return { success: true, transactionId };
    } catch (error) {
      console.error("Transaction error:", error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    load,

    getHotelBalance,
    executeTransaction,
  };
};
