import { System } from "modules/system/main.ts";

export const getBalanceEntry = async (
  entity: "hotel" | "users",
  account?: string,
) => {
  if (entity === "users" && !account)
    throw new Error("Account required for users");
  const key =
    entity === "hotel" ? ["hotel", "balance"] : ["users", account!, "balance"];
  return await System.db.getRaw<number>(key);
};

export const validateBalance = (
  entry: Deno.KvEntryMaybe<number>,
  minAmount: number,
) => {
  const balance = Number(entry.value);
  if (balance < minAmount || isNaN(balance)) {
    throw new Error("Insufficient balance.");
  }
};

export const buildAtomicTransaction = (
  atomic: Deno.AtomicOperation,
  fromEntry: Deno.KvEntryMaybe<number>,
  toEntry: Deno.KvEntryMaybe<number>,
  amount: number,
) => {
  return atomic
    .check(fromEntry)
    .check(toEntry)
    .set(fromEntry.key, Number(fromEntry.value) - amount)
    .set(toEntry.key, Number(toEntry.value) + amount);
};
