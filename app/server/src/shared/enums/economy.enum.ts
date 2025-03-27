export enum TransactionType {
  REWARD = "reward", // Hotel -> User (games prize)
  PURCHASE = "purchase", // User -> Hotel (buying an item)
  REFUND = "refund", // Hotel -> User (purchase rollback)
  DEPOSIT = "deposit", // onet -> User (onet money to hotel money)
  WITHDRAWAL = "withdrawal", // User -> onet (hotel money to onet money)
  TRANSFER = "transfer", // User → User (sending money)
}
