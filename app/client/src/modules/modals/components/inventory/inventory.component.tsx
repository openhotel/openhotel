import React, { useCallback, useEffect, useState } from "react";
import {
  ContainerComponent,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  SpriteComponent,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { useApi } from "shared/hooks";
import { InventoryFurniture } from "shared/types";
import { TextComponent } from "shared/components";

export const InventoryComponent: React.FC = () => {
  const { fetch } = useApi();

  const [furniture, setFurniture] = useState<InventoryFurniture[]>([]);

  const $reload = useCallback(
    () =>
      fetch("/inventory").then(({ furniture }) => {
        const uniqueFurnitureIds = [
          ...new Set(furniture.map((furniture) => furniture.furnitureId)),
        ] as string[];
        setFurniture(
          uniqueFurnitureIds.map((furnitureId) => ({
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
  return (
    <ContainerComponent>
      <SpriteComponent
        spriteSheet={SpriteSheetEnum.HOT_BAR_ICONS}
        texture="box"
      />
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={100}
        height={100}
      />
      <FlexContainerComponent direction="y">
        {furniture.map((furniture) => (
          <React.Fragment key={furniture.furnitureId}>
            <TextComponent
              text={furniture.furnitureId + ` x${furniture.ids.length}`}
              tint={0}
            />
          </React.Fragment>
        ))}
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
