import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
  NineSliceSpriteComponent,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { ScrollComponent } from "shared/components/scroll";
import { FURNITURE_ICON_BOX_SIZE, FURNITURE_ICON_SIZE } from "shared/consts";

export type Item = {
  key: string;
  render: () => React.ReactNode;
};

type Props = {
  rows: number;
  cols: number;
  height?: number;
  items?: Item[];
  onSelect?: (key: string) => void;
} & ContainerProps;

export const ItemListComponent: React.FC<Props> = ({
  rows,
  cols,
  height,
  items = [],
  onSelect,
  ...containerProps
}) => {
  const [selected, setSelected] = useState<string>(null);

  const $onSelect = useCallback(
    (index: number) => () => {
      const item = items[index];

      if (selected === item?.key || (!item && !selected)) return;

      onSelect?.(item ? item.key : null);
      setSelected(item ? item.key : null);
    },
    [items, onSelect, selected],
  );

  const selectedIndex = useMemo(
    () => items.findIndex((item) => item.key === selected),
    [selected, items],
  );

  const renderItemsBackgrounds = useMemo(() => {
    const $items = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = x + y * cols;

        $items.push(() => (
          <ContainerComponent
            position={{
              x: x * (FURNITURE_ICON_BOX_SIZE + 3),
              y: y * (FURNITURE_ICON_BOX_SIZE + 3),
            }}
            eventMode={EventMode.STATIC}
            cursor={Cursor.POINTER}
            onPointerDown={$onSelect(index)}
          >
            <NineSliceSpriteComponent
              spriteSheet={SpriteSheetEnum.UI}
              texture="background-circle-x6"
              leftWidth={2}
              rightWidth={2}
              topHeight={2}
              bottomHeight={2}
              width={FURNITURE_ICON_BOX_SIZE}
              height={FURNITURE_ICON_BOX_SIZE}
              tint={0xe0e0e0}
            />
            {selectedIndex === index ? (
              <NineSliceSpriteComponent
                spriteSheet={SpriteSheetEnum.UI}
                texture="background-circle-x6"
                leftWidth={2}
                rightWidth={2}
                topHeight={2}
                bottomHeight={2}
                width={FURNITURE_ICON_SIZE}
                height={FURNITURE_ICON_SIZE}
                position={{
                  x: 1,
                  y: 1,
                }}
                tint={0xf5f5f5}
              />
            ) : null}
          </ContainerComponent>
        ));
      }
    }
    return $items.map((Comp, index) => <Comp key={`empty_${index}`} />);
  }, [rows, cols, $onSelect, selected, selectedIndex]);

  const renderItems = useMemo(() => {
    const $items = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = x + y * cols;
        const item = items[index];
        if (!item) continue;

        $items.push(() => (
          <ContainerComponent
            position={{
              x: x * (FURNITURE_ICON_BOX_SIZE + 3),
              y: y * (FURNITURE_ICON_BOX_SIZE + 3),
            }}
            pivot={{
              x: -1,
              y: -1,
            }}
            eventMode={EventMode.NONE}
          >
            {item.render()}
          </ContainerComponent>
        ));
      }
    }
    return $items.map((Comp, index) => (
      <Comp key={`item_${items[index].key}`} />
    ));
  }, [rows, cols, items]);

  useEffect(() => {
    setSelected(null);
  }, [items, setSelected]);

  if (height)
    return useMemo(
      () => (
        <ScrollComponent
          size={{
            height,
            width: (FURNITURE_ICON_BOX_SIZE + 3) * cols,
          }}
          {...containerProps}
        >
          {renderItemsBackgrounds}
          {renderItems}
        </ScrollComponent>
      ),
      [height, cols, containerProps, renderItemsBackgrounds, renderItems],
    );

  return useMemo(
    () => (
      <ContainerComponent {...containerProps}>
        {renderItemsBackgrounds}
        {renderItems}
      </ContainerComponent>
    ),
    [containerProps, renderItemsBackgrounds, renderItems],
  );
};
