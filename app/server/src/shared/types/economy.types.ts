import { TransactionType } from "../enums/economy.enum.ts";

export interface TransactionParams {
  type: TransactionType;
  amount: number;
  fromAccount?: string;
  toAccount?: string;
  meta?: Record<string, any>;
}
