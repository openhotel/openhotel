import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ContainerComponent,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  SpriteComponent,
  SpriteRef,
} from "@openhotel/pixi-components";
import { FURNITURE_ICON_SIZE } from "shared/consts";
import { TextComponent } from "shared/components/text";
import { useFurniture } from "shared/hooks";
import { FurnitureData, Point2d } from "shared/types";
import { FurnitureType, SpriteSheetEnum } from "shared/enums";

type Props = {
  furnitureId: string;
  type?: FurnitureType;
  amount?: number;
};

export const FurnitureItemComponent: React.FC<Props> = ({
  furnitureId,
  type = FurnitureType.FURNITURE,
  amount,
}) => {
  const spriteRef = useRef<SpriteRef>(null);

  const { get, load } = useFurniture();
  const [data, setData] = useState<FurnitureData>(null);
  const [iconPivot, setIconPivot] = useState<Point2d>({ x: 0, y: 0 });

  useEffect(() => {
    load(furnitureId).then(() => setData(get(furnitureId)));
  }, [load, get, furnitureId]);

  const renderAmount = useMemo(
    () =>
      amount > 1 ? (
        <ContainerComponent
          position={{
            y: FURNITURE_ICON_SIZE - 7,
          }}
        >
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={FURNITURE_ICON_SIZE}
            height={7}
            alpha={0.5}
            tint={0}
          />
          <FlexContainerComponent
            size={{
              width: FURNITURE_ICON_SIZE - 1,
            }}
            justify={FLEX_JUSTIFY.END}
          >
            <TextComponent
              text={"x" + amount}
              padding={{
                right: 1,
                top: 1,
              }}
            />
          </FlexContainerComponent>
        </ContainerComponent>
      ) : null,
    [amount],
  );

  useEffect(() => {
    if (!spriteRef.current) return;

    const { width, height } = spriteRef.current.texture.frame;

    setIconPivot({
      x: (width - FURNITURE_ICON_SIZE) / 2,
      y: (height - FURNITURE_ICON_SIZE) / 2,
    });
  }, [data, setIconPivot]);

  return useMemo(
    () => (
      <>
        {data ? (
          <SpriteComponent
            ref={spriteRef}
            texture={data.icon.texture}
            spriteSheet={data.spriteSheet}
            pivot={iconPivot}
          />
        ) : (
          <SpriteComponent
            texture={
              type === FurnitureType.FURNITURE ? "box-icon" : "frame-icon"
            }
            spriteSheet={SpriteSheetEnum.FURNITURE_DUMMY}
            position={{
              x: type === FurnitureType.FURNITURE ? 1 : 3,
              y: 0,
            }}
          />
        )}
        {renderAmount}
      </>
    ),
    [data, renderAmount, type, iconPivot],
  );
};
