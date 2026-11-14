import React, { useMemo } from "react";
import {
  ContainerComponent,
  ContainerProps,
  GraphicsComponent,
  GraphicType,
  Size,
} from "@openhotel/pixi-components";
import { FurnitureComponent, FurnitureFrameComponent } from "shared/components";
import { CrossDirection, FurnitureType } from "shared/enums";
import { FurnitureData } from "shared/types";
import { TILE_SIZE } from "shared/consts";

type Props = {
  furnitureData: FurnitureData;
  size: Size;
} & ContainerProps;

export const FurniturePreviewComponent: React.FC<Props> = ({
  furnitureData,
  size,

  ...containerProps
}) => {
  const isFurniture = useMemo(
    () => furnitureData.type === FurnitureType.FURNITURE,
    [furnitureData],
  );

  return useMemo(
    () => (
      <ContainerComponent {...containerProps}>
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={size.width}
          height={size.height}
          tint={0xff00ff}
          alpha={0}
        />
        <ContainerComponent
          position={{
            x: size.width / 2,
            y:
              (size.height + furnitureData.size.height - TILE_SIZE.height / 2) /
              2,
          }}
        >
          {isFurniture ? (
            <>
              <FurnitureComponent
                position={{ x: -1, y: 0, z: 0 }}
                furnitureId={furnitureData.furnitureId}
              />
            </>
          ) : (
            <>
              <FurnitureFrameComponent
                position={{ x: -1, y: 0, z: 0 }}
                framePosition={{
                  x: 0,
                  y: furnitureData.size.height - TILE_SIZE.height,
                }}
                furnitureId={furnitureData.furnitureId}
                direction={CrossDirection.EAST}
              />
            </>
          )}
        </ContainerComponent>
      </ContainerComponent>
    ),
    [containerProps, isFurniture, furnitureData, size],
  );
};
