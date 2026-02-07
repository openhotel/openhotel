export enum MarketplaceListingStatus {
  ACTIVE = "active",
  SOLD = "sold",
  CANCELLED = "cancelled",
}

export type MarketplaceListing = {
  id: string;
  sellerId: string;
  furnitureId: string;
  instanceId: string;
  listPrice: number;
  catalogPrice: number;
  isRetired: boolean;
  status: MarketplaceListingStatus;
  createdAt: number;
  soldAt?: number;
  buyerId?: string;
};

export type MarketplaceConfig = {
  commissionRate: number;
  retiredCommissionRate: number;
  minPricePercent: number;
  maxPricePercent: number;
};
