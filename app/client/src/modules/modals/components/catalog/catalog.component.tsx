import React, { useEffect, useMemo } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  NineSliceSpriteComponent,
  TilingSpriteComponent,
  useDragContainer,
} from "@openhotel/pixi-components";
import { Modal, SpriteSheetEnum } from "shared/enums";
import { ScrollComponent, TextComponent } from "shared/components";
import { CategoriesComponent } from ".";
import { MODAL_SIZE_MAP } from "shared/consts";

const HEADER_HEIGHT = 17;
const CONTENT_PADDING = 5;

const OVER_MODAL_POSITION = {
  x: 12,
};
const OVER_MODAL_PADDING = 5;

type WrapperProps = {
  onPointerDown?: () => void;
};

export const CatalogComponentWrapper: React.FC<WrapperProps> = ({
  onPointerDown,
}) => {
  const { setDragPolygon } = useDragContainer();
  const { width, height } = MODAL_SIZE_MAP[Modal.CATALOG];

  const categorySize = useMemo(
    () => ({
      width: 75,
      height: height - 28 - 5,
    }),
    [height],
  );

  const overModalSize = useMemo(
    () => ({
      width: width - (categorySize.width + 25),
      height: height + OVER_MODAL_PADDING * 2,
    }),
    [width, height, categorySize],
  );

  useEffect(() => {
    setDragPolygon?.([
      0,
      5,
      //
      OVER_MODAL_POSITION.x,
      5,
      //
      OVER_MODAL_POSITION.x,
      0,
      //
      overModalSize.width + OVER_MODAL_POSITION.x,
      0,
      //
      overModalSize.width + OVER_MODAL_POSITION.x,
      5,
      //
      width,
      5,
      //
      width,
      20,
      //
      overModalSize.width + OVER_MODAL_POSITION.x - 6,
      20,
      //
      overModalSize.width + OVER_MODAL_POSITION.x - 6,
      6,
      //
      OVER_MODAL_POSITION.x + 6,
      6,
      //
      OVER_MODAL_POSITION.x + 6,
      20,
      //
      0,
      20,
    ]);
  }, [setDragPolygon, overModalSize]);

  return (
    <>
      <GraphicsComponent
        type={GraphicType.CIRCLE}
        radius={6.5}
        alpha={0}
        cursor={Cursor.POINTER}
        eventMode={EventMode.STATIC}
        position={{
          x: width - 23,
          y: 1.5,
        }}
        onPointerDown={onPointerDown}
        zIndex={20}
        pivot={{ x: 0, y: -5 }}
      />
      <ContainerComponent>
        <ContainerComponent position={{ y: OVER_MODAL_PADDING }}>
          <NineSliceSpriteComponent
            spriteSheet={SpriteSheetEnum.UI}
            texture="ui-base-modal"
            leftWidth={14}
            rightWidth={21}
            topHeight={22}
            bottomHeight={11}
            height={height}
            width={width}
          />
          <TilingSpriteComponent
            texture="ui-base-modal-bar-tile"
            spriteSheet={SpriteSheetEnum.UI}
            position={{
              x: 11,
              y: 4,
            }}
            width={width - 35}
          />
          <FlexContainerComponent
            justify={FLEX_JUSTIFY.CENTER}
            size={{
              width,
            }}
            position={{
              y: 4,
            }}
          >
            <TextComponent
              text="Catalog"
              backgroundColor={0xacc1ed}
              backgroundAlpha={1}
              padding={{
                left: 4,
                right: 3,
                bottom: 0,
                top: 1,
              }}
            />
          </FlexContainerComponent>
          <ScrollComponent
            size={{
              height: categorySize.height,
              width: categorySize.width - 10,
            }}
            position={{
              x: OVER_MODAL_POSITION.x + overModalSize.width,
              y: HEADER_HEIGHT + CONTENT_PADDING,
            }}
          >
            <CategoriesComponent
              width={categorySize.width - 15}
              categories={[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
                "13",
                "14",
              ]}
            />
          </ScrollComponent>
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            tint={0}
            alpha={0.125}
            width={overModalSize.width + 2}
            height={height}
            pivot={{
              x: 1,
            }}
            position={OVER_MODAL_POSITION}
          />
        </ContainerComponent>
        <ContainerComponent position={OVER_MODAL_POSITION}>
          <NineSliceSpriteComponent
            spriteSheet={SpriteSheetEnum.UI}
            texture="catalog-base-modal"
            leftWidth={3}
            rightWidth={3}
            topHeight={3}
            bottomHeight={6}
            width={overModalSize.width}
            height={overModalSize.height}
          />
          <ContainerComponent position={{ x: 6, y: 6 }}>
            <GraphicsComponent
              type={GraphicType.RECTANGLE}
              width={overModalSize.width - 12}
              height={overModalSize.height - 16}
              tint={0xff00ff}
            />
          </ContainerComponent>
        </ContainerComponent>
      </ContainerComponent>
    </>
  );
};
