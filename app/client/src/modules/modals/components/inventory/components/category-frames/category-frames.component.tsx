import React, { useCallback, useEffect, useState } from "react";
import { InventoryFurniture, ModalInventoryCategoryProps } from "shared/types";
import { useApi } from "shared/hooks";
import { FurnitureType } from "shared/enums";
import { InventoryContentComponent } from "../inventory-content";

export const CategoryFramesComponent: React.FC<ModalInventoryCategoryProps> = ({
  size,
}) => {
  const { fetch } = useApi();
  const [furniture, setFurniture] = useState<InventoryFurniture[]>([]);

  const $reload = useCallback(
    () =>
      fetch(`/inventory?type=${FurnitureType.FRAME}`).then(({ furniture }) => {
        const uniqueFurnitureIds = [
          ...new Set(furniture.map((furniture) => furniture.furnitureId)),
        ] as string[];
        setFurniture(
          uniqueFurnitureIds.map((furnitureId) => ({
            type: furniture.find(
              (furniture) => furniture.furnitureId === furnitureId,
            ).type,
            furnitureId,
            ids: furniture
              .filter((furniture) => furniture.furnitureId === furnitureId)
              .map((furniture) => furniture.id),
          })),
        );
      }),
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

  return <InventoryContentComponent size={size} furniture={furniture} />;
};
