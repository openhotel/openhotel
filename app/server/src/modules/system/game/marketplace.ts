import { log } from "shared/utils/log.utils.ts";
import { System } from "../main.ts";
import { ulid } from "@std/ulid";
import { TransactionType } from "shared/enums/economy.enum.ts";
import {
  MarketplaceConfig,
  MarketplaceListing,
  MarketplaceListingStatus,
} from "shared/types/marketplace.types.ts";
import { DEFAULT_MARKETPLACE_CONFIG } from "shared/consts/marketplace.consts.ts";
import { Furniture } from "shared/types/furniture.types.ts";

export const marketplace = () => {
  let config: MarketplaceConfig = DEFAULT_MARKETPLACE_CONFIG;

  const load = () => {
    log("> Loading marketplace...");

    const serverConfig = System.config.get();
    if (serverConfig.marketplace) {
      config = {
        ...DEFAULT_MARKETPLACE_CONFIG,
        ...serverConfig.marketplace,
      };
    }

    log("> Marketplace loaded!");
  };

  const getConfig = (): MarketplaceConfig => config;

  const getCatalogPriceForFurniture = async (
    furnitureId: string,
  ): Promise<number | null> => {
    const catalog = await System.game.furniture.getCatalog();

    for (const category of catalog.categories) {
      const furniture = category.furniture.find((f) => f.id === furnitureId);
      if (furniture) {
        return furniture.price;
      }
    }

    return null;
  };

  const isRetiredFurniture = async (furnitureId: string): Promise<boolean> => {
    const catalog = await System.game.furniture.getCatalog();

    const now = Date.now();
    for (const category of catalog.categories) {
      const isEnabled = category.enabled;

      const isInRange =
        !category.range ||
        ((!category.range.from ||
          new Date(category.range.from).getTime() <= now) &&
          (!category.range.to || new Date(category.range.to).getTime() >= now));

      if (
        isEnabled &&
        isInRange &&
        category.furniture.some((f) => f.id === furnitureId)
      ) {
        return false;
      }
    }

    const price = await getCatalogPriceForFurniture(furnitureId);
    return price !== null;
  };

  const getPriceLimits = async (
    furnitureId: string,
  ): Promise<{ min: number; max: number; catalogPrice: number } | null> => {
    const catalogPrice = await getCatalogPriceForFurniture(furnitureId);
    if (catalogPrice === null) return null;

    return {
      min: Math.ceil(catalogPrice * config.minPricePercent),
      max: Math.floor(catalogPrice * config.maxPricePercent),
      catalogPrice,
    };
  };

  const calculateSellerEarnings = (listPrice: number, isRetired: boolean) => {
    let commissionRate = config.commissionRate;
    if (isRetired) {
      commissionRate += config.retiredCommissionRate;
    }

    const hotelCommission = Math.floor(listPrice * commissionRate);
    const sellerEarnings = listPrice - hotelCommission;

    return { sellerEarnings, hotelCommission };
  };

  const listFurniture = async (
    sellerId: string,
    instanceId: string,
    listPrice: number,
  ): Promise<{
    success: boolean;
    listing?: MarketplaceListing;
    error?: string;
  }> => {
    try {
      const furnitureData = (await System.db.get([
        "users",
        sellerId,
        "inventory",
        instanceId,
      ])) as Furniture | null;

      if (!furnitureData) {
        return { success: false, error: "Furniture not found in inventory" };
      }

      if (furnitureData.marketplaceListingId) {
        return {
          success: false,
          error: "Furniture is already listed on marketplace",
        };
      }

      const furnitureId = furnitureData.furnitureId;

      const priceLimits = await getPriceLimits(furnitureId);
      if (!priceLimits) {
        return { success: false, error: "Furniture not found in catalog" };
      }

      if (listPrice < priceLimits.min || listPrice > priceLimits.max) {
        return {
          success: false,
          error: `Price must be between ${priceLimits.min} and ${priceLimits.max}`,
        };
      }

      const isRetired = await isRetiredFurniture(furnitureId);
      const listingId = ulid();

      const listing: MarketplaceListing = {
        id: listingId,
        sellerId,
        furnitureId,
        instanceId,
        listPrice,
        catalogPrice: priceLimits.catalogPrice,
        isRetired,
        status: MarketplaceListingStatus.ACTIVE,
        createdAt: Date.now(),
      };

      const atomic = System.db.atomic();
      atomic.set(["marketplace", "listings", listingId], listing);
      atomic.set(
        ["marketplace", "byFurniture", furnitureId, listingId],
        listingId,
      );
      atomic.set(["marketplace", "bySeller", sellerId, listingId], listingId);

      if (isRetired) {
        atomic.set(["marketplace", "retired", listingId], listingId);
      }

      atomic.set(["users", sellerId, "inventory", instanceId], {
        ...furnitureData,
        marketplaceListingId: listingId,
      });

      const result = await atomic.commit();
      if (!result.ok) {
        return { success: false, error: "Failed to create listing" };
      }

      return { success: true, listing };
    } catch (error) {
      console.error("Marketplace list error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const cancelListing = async (
    sellerId: string,
    listingId: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const listing = (await System.db.get([
        "marketplace",
        "listings",
        listingId,
      ])) as MarketplaceListing | null;

      if (!listing) {
        return { success: false, error: "Listing not found" };
      }

      if (listing.sellerId !== sellerId) {
        return {
          success: false,
          error: "Not authorized to cancel this listing",
        };
      }

      if (listing.status !== MarketplaceListingStatus.ACTIVE) {
        return { success: false, error: "Listing is not active" };
      }

      const furnitureData = (await System.db.get([
        "users",
        sellerId,
        "inventory",
        listing.instanceId,
      ])) as Furniture | null;

      if (!furnitureData) {
        return { success: false, error: "Furniture not found" };
      }

      const atomic = System.db.atomic();
      atomic.set(["marketplace", "listings", listingId], {
        ...listing,
        status: MarketplaceListingStatus.CANCELLED,
      });

      atomic.delete([
        "marketplace",
        "byFurniture",
        listing.furnitureId,
        listingId,
      ]);
      atomic.delete(["marketplace", "bySeller", sellerId, listingId]);

      if (listing.isRetired) {
        atomic.delete(["marketplace", "retired", listingId]);
      }

      const { marketplaceListingId: _, ...rest } = furnitureData;
      atomic.set(["users", sellerId, "inventory", listing.instanceId], rest);

      const result = await atomic.commit();
      if (!result.ok) {
        return { success: false, error: "Failed to cancel listing" };
      }

      return { success: true };
    } catch (error) {
      console.error("Marketplace cancel error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const getCheapestListing = async (
    furnitureId: string,
  ): Promise<MarketplaceListing | null> => {
    const { items } = await System.db.list({
      prefix: ["marketplace", "byFurniture", furnitureId],
    });

    if (items.length === 0) return null;

    const listings = await Promise.all(
      items.map(async (item) => {
        return (await System.db.get([
          "marketplace",
          "listings",
          item.value,
        ])) as MarketplaceListing;
      }),
    );

    const activeListings = listings.filter(
      (l) => l && l.status === MarketplaceListingStatus.ACTIVE,
    );

    if (activeListings.length === 0) return null;

    activeListings.sort((a, b) => a.listPrice - b.listPrice);
    return activeListings[0];
  };

  const getListingsByFurnitureId = async (
    furnitureId: string,
  ): Promise<MarketplaceListing[]> => {
    const { items } = await System.db.list({
      prefix: ["marketplace", "byFurniture", furnitureId],
    });

    const listings = await Promise.all(
      items.map(async (item) => {
        return (await System.db.get([
          "marketplace",
          "listings",
          item.value,
        ])) as MarketplaceListing;
      }),
    );

    return listings
      .filter((l) => l && l.status === MarketplaceListingStatus.ACTIVE)
      .sort((a, b) => a.listPrice - b.listPrice);
  };

  const getRetiredListings = async (): Promise<MarketplaceListing[]> => {
    const { items } = await System.db.list({
      prefix: ["marketplace", "retired"],
    });

    const listings = await Promise.all(
      items.map(async (item) => {
        return (await System.db.get([
          "marketplace",
          "listings",
          item.value,
        ])) as MarketplaceListing;
      }),
    );

    return listings
      .filter((l) => l && l.status === MarketplaceListingStatus.ACTIVE)
      .sort((a, b) => a.listPrice - b.listPrice);
  };

  const getListingsBySeller = async (
    sellerId: string,
  ): Promise<MarketplaceListing[]> => {
    const { items } = await System.db.list({
      prefix: ["marketplace", "bySeller", sellerId],
    });

    const listings = await Promise.all(
      items.map(async (item) => {
        return (await System.db.get([
          "marketplace",
          "listings",
          item.value,
        ])) as MarketplaceListing;
      }),
    );

    return listings.filter(
      (l) => l && l.status === MarketplaceListingStatus.ACTIVE,
    );
  };

  const buyFromMarketplace = async (
    buyerId: string,
    listingId: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const listing = (await System.db.get([
        "marketplace",
        "listings",
        listingId,
      ])) as MarketplaceListing | null;

      if (!listing) {
        return { success: false, error: "Listing not found" };
      }

      if (listing.status !== MarketplaceListingStatus.ACTIVE) {
        return { success: false, error: "Listing is no longer available" };
      }

      if (listing.sellerId === buyerId) {
        return { success: false, error: "Cannot buy your own listing" };
      }

      const { sellerEarnings, hotelCommission } = calculateSellerEarnings(
        listing.listPrice,
        listing.isRetired,
      );

      const furnitureData = (await System.db.get([
        "users",
        listing.sellerId,
        "inventory",
        listing.instanceId,
      ])) as Furniture | null;

      if (!furnitureData) {
        return { success: false, error: "Furniture no longer exists" };
      }

      const transactionResult = await System.game.economy.executeTransaction({
        type: TransactionType.MARKETPLACE_SALE,
        description: `Marketplace: ${listing.furnitureId}`,
        amount: listing.listPrice,
        fromAccount: buyerId,
        toAccount: listing.sellerId,
        meta: {
          listingId,
          furnitureId: listing.furnitureId,
          instanceId: listing.instanceId,
          hotelCommission,
          sellerEarnings,
        },
      });

      if (!transactionResult.success) {
        return { success: false, error: transactionResult.error };
      }

      const atomic = System.db.atomic();
      atomic.set(["marketplace", "listings", listingId], {
        ...listing,
        status: MarketplaceListingStatus.SOLD,
        soldAt: Date.now(),
        buyerId,
      });

      atomic.delete([
        "marketplace",
        "byFurniture",
        listing.furnitureId,
        listingId,
      ]);
      atomic.delete(["marketplace", "bySeller", listing.sellerId, listingId]);

      if (listing.isRetired) {
        atomic.delete(["marketplace", "retired", listingId]);
      }

      atomic.delete([
        "users",
        listing.sellerId,
        "inventory",
        listing.instanceId,
      ]);

      const { marketplaceListingId: _, ...rest } = furnitureData;
      atomic.set(["users", buyerId, "inventory", listing.instanceId], rest);

      const result = await atomic.commit();
      if (!result.ok) {
        return { success: false, error: "Failed to complete purchase" };
      }

      return { success: true };
    } catch (error) {
      console.error("Marketplace buy error:", error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    load,
    getConfig,
    getCatalogPriceForFurniture,
    isRetiredFurniture,
    getPriceLimits,
    calculateSellerEarnings,
    listFurniture,
    cancelListing,
    getCheapestListing,
    getListingsByFurnitureId,
    getRetiredListings,
    getListingsBySeller,
    buyFromMarketplace,
  };
};
