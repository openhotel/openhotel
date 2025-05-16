import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Cursor,
  EventMode,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  SpriteComponent,
  useTextures,
} from "@openhotel/pixi-components";
import { useApi, useApiPath } from "shared/hooks";
import { ItemComponent } from "shared/components";

const ITEM_SIZE = {
  width: 96,
  height: 64,
};

type Props = {
  onChange?: (layoutId: number) => void;
};

export const LayoutsComponent: React.FC<Props> = ({ onChange }) => {
  const { fetch } = useApi();
  const { getPath } = useApiPath();
  const { loadTexture, getTexture } = useTextures();

  const [selectedLayout, setSelectedLayout] = useState<number>(null);
  const [layoutList, setLayoutList] = useState<number[]>([]);

  const getLayoutTexture = useCallback(
    (layoutId: number) => getPath(`/room/layout?id=${layoutId}`),
    [getPath],
  );

  const onSelectLayout = useCallback(
    (layoutId: number) => () => {
      onChange?.(layoutId);
      setSelectedLayout(layoutId);
    },
    [onChange, setSelectedLayout],
  );

  useEffect(() => {
    fetch("/room/layouts").then(async ({ layouts }) => {
      const layoutList = layouts.map((layout) => layout.id) as number[];
      for (const layoutId of layoutList.filter(
        (layoutId) =>
          !getTexture({
            texture: getLayoutTexture(layoutId),
          }),
      ))
        await loadTexture(getLayoutTexture(layoutId));
      setLayoutList(layoutList);
      onSelectLayout(layoutList[0])();
    });
  }, [fetch, getPath, setLayoutList, onSelectLayout]);

  const renderList = useMemo(
    () =>
      layoutList.map((layoutId) => (
        <ItemComponent
          key={layoutId}
          size={ITEM_SIZE}
          color={selectedLayout === layoutId ? "blue" : "gray"}
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
          onPointerDown={onSelectLayout(layoutId)}
        >
          <FlexContainerComponent
            justify={FLEX_JUSTIFY.CENTER}
            align={FLEX_ALIGN.CENTER}
            size={{
              width: ITEM_SIZE.width - 4 - 2,
              height: ITEM_SIZE.height - 4 - 2,
            }}
          >
            <SpriteComponent texture={getLayoutTexture(layoutId)} />
          </FlexContainerComponent>
        </ItemComponent>
      )),
    [layoutList, selectedLayout, getLayoutTexture, onSelectLayout],
  );

  return (
    <FlexContainerComponent direction="y" gap={3}>
      {renderList}
    </FlexContainerComponent>
  );
};
