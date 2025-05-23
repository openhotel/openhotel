import { TransactionType } from "../enums";

export type TransactionParams = {
  type: TransactionType;
  description: string;
  amount: number;
  fromAccount?: string;
  toAccount?: string;
  meta?: Record<string, any>;
};

export type Transaction = {
  id: string;
  timestamp: number;
} & TransactionParams;

export type Economy = {
  credits: number;
  transactions: Transaction[];
};
