import React, { useEffect, useMemo, useState } from "react";
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
import { useApi, useModal } from "shared/hooks";
import { Catalog } from "shared/types";
import {
  CategoryComponent,
  HEADER_SIZE,
} from "modules/modals/components/catalog/components/category/category.component";

const HEADER_HEIGHT = 17;
const CONTENT_PADDING = 5;

const OVER_MODAL_POSITION = {
  x: 12,
};
const OVER_MODAL_PADDING = 5;

export const CatalogComponent: React.FC = () => {
  const { closeModal } = useModal();
  const { fetch } = useApi();

  const [catalog, setCatalog] = useState<Catalog>(null);

  useEffect(() => {
    fetch("/catalog").then(setCatalog);
  }, [fetch, setCatalog]);

  return useMemo(
    () =>
      catalog ? (
        <CatalogComponentWrapper
          onPointerDown={() => closeModal(Modal.CATALOG)}
          catalog={catalog}
        />
      ) : null,
    [catalog],
  );
};

type WrapperProps = {
  onPointerDown?: () => void;
  catalog: Catalog;
};

export const CatalogComponentWrapper: React.FC<WrapperProps> = ({
  onPointerDown,
  catalog,
}) => {
  const { setDragPolygon } = useDragContainer();
  const { width, height } = MODAL_SIZE_MAP[Modal.CATALOG];

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("home");

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
      6 + HEADER_SIZE,
      //
      OVER_MODAL_POSITION.x + 6,
      6 + HEADER_SIZE,
      //
      OVER_MODAL_POSITION.x + 6,
      20,
      //
      0,
      20,
    ]);
  }, [setDragPolygon, overModalSize]);

  const category = useMemo(
    () =>
      catalog?.categories?.find(
        (category) => category.id === selectedCategoryId,
      ),
    [selectedCategoryId, catalog],
  );

  const contentSize = useMemo(
    () => ({
      width: overModalSize.width - 12,
      height: overModalSize.height - 16,
    }),
    [overModalSize],
  );

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
          <ContainerComponent
            position={{
              x: OVER_MODAL_POSITION.x + overModalSize.width,
            }}
          >
            <FlexContainerComponent
              justify={FLEX_JUSTIFY.CENTER}
              size={{
                width: categorySize.width - 13,
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
                  top: 2,
                }}
              />
            </FlexContainerComponent>
            <ScrollComponent
              size={{
                height: categorySize.height,
                width: categorySize.width - 10,
              }}
              position={{
                y: HEADER_HEIGHT + CONTENT_PADDING,
              }}
            >
              <CategoriesComponent
                width={categorySize.width - 13}
                categories={catalog.categories}
                selectedCategoryId={selectedCategoryId}
                onSelectedCategory={setSelectedCategoryId}
              />
            </ScrollComponent>
          </ContainerComponent>

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
            {selectedCategoryId === "home" ? (
              <GraphicsComponent
                type={GraphicType.RECTANGLE}
                tint={0}
                alpha={0.2}
                width={contentSize.width}
                height={contentSize.height}
              />
            ) : (
              <CategoryComponent
                size={contentSize}
                category={category}
                categoryId={selectedCategoryId}
              />
            )}
          </ContainerComponent>
        </ContainerComponent>
      </ContainerComponent>
    </>
  );
};
