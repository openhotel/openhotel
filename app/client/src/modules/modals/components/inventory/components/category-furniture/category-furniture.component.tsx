import React, { useCallback, useEffect, useState } from "react";
import { InventoryFurniture, ModalInventoryCategoryProps } from "shared/types";
import { InventoryContentComponent } from "../inventory-content";
import { useApi } from "shared/hooks";
import { FurnitureType } from "shared/enums";

type RawFurniture = {
  id: string;
  furnitureId: string;
  type: FurnitureType;
  marketplaceListingId?: string;
};

export const CategoryFurnitureComponent: React.FC<
  ModalInventoryCategoryProps
> = ({ size }) => {
  const { fetch } = useApi();
  const [furniture, setFurniture] = useState<InventoryFurniture[]>([]);

  const $reload = useCallback(
    () =>
      fetch(`/inventory?type=${FurnitureType.FURNITURE}`).then(
        ({ furniture }: { furniture: RawFurniture[] }) => {
          const uniqueFurnitureIds = [
            ...new Set(furniture.map((furniture) => furniture.furnitureId)),
          ] as string[];

          setFurniture(
            uniqueFurnitureIds.map((furnitureId) => {
              const items = furniture.filter(
                (f) => f.furnitureId === furnitureId,
              );
              const marketplaceListingIds: Record<string, string> = {};
              items.forEach((item) => {
                if (item.marketplaceListingId) {
                  marketplaceListingIds[item.id] = item.marketplaceListingId;
                }
              });

              return {
                type: items[0].type,
                furnitureId,
                ids: items.map((f) => f.id),
                marketplaceListingIds:
                  Object.keys(marketplaceListingIds).length > 0
                    ? marketplaceListingIds
                    : undefined,
              };
            }),
          );
        },
      ),
    [fetch],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      $reload();
    }, 30_000);
    $reload();

    return () => {
      clearInterval(interval);
    };
  }, [$reload]);

  return (
    <InventoryContentComponent
      size={size}
      furniture={furniture}
      onRefresh={$reload}
    />
  );
};
