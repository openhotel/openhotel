import { MarketplaceConfig } from "../types/marketplace.types.ts";

export const DEFAULT_MARKETPLACE_CONFIG: MarketplaceConfig = {
  commissionRate: 0.1,
  retiredCommissionRate: 0.05, // 5% extra for retired items
  minPricePercent: 0.3,
  maxPricePercent: 1.0,
};
