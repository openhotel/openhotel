import { TransactionType } from "../enums/economy.enum.ts";

export interface TransactionParams {
  type: TransactionType;
  description: string;
  amount: number;
  fromAccount?: string;
  toAccount?: string;
  meta?: Record<string, any>;
}

export interface Transaction extends TransactionParams {
  id: string;
  timestamp: number;
}
