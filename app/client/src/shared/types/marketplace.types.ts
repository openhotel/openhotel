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

export type MarketplacePriceLimits = {
  min: number;
  max: number;
  catalogPrice: number;
  isRetired: boolean;
  commissionRate: number;
};

export type MarketplaceRetiredFurniture = {
  furnitureId: string;
  catalogPrice: number;
  cheapestPrice: number;
  count: number;
};
