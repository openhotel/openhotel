import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ContainerComponent,
  ContainerRef,
  EventMode,
  HorizontalAlign,
  SpriteComponent,
} from "@openhotel/pixi-components";
import {
  HOT_BAR_HEIGHT_FULL,
  STEP_TILE_HEIGHT,
  TEXT_BACKGROUND_BASE,
  TILE_SIZE,
  TILE_WIDTH,
} from "shared/consts";
import { FurnitureData, Point2d, Size2d, User } from "shared/types";
import {
  CharacterComponent,
  FurnitureComponentWrapper,
  TextComponent,
} from "shared/components";
import {
  CharacterArmAction,
  CharacterBodyAction,
  Direction,
  PrivateRoomPreviewType,
  SpriteSheetEnum,
} from "shared/enums";
import { FurnitureFrameComponentWrapper } from "shared/components/furniture-frame";
import { usePrivateRoom } from "shared/hooks";

const TileComponent: React.FC<{ position: Point2d }> = ({ position }) =>
  useMemo(
    () => (
      <SpriteComponent
        texture="tile"
        spriteSheet={SpriteSheetEnum.ROOM}
        eventMode={EventMode.NONE}
        tint={0xc0bead}
        position={position}
      />
    ),
    [position],
  );

export const SelectionPreviewComponent: React.FC = () => {
  const textContainerRef = useRef<ContainerRef>(null);

  const { selectedPreview } = usePrivateRoom();

  const [textSize, setTextSize] = useState<Size2d>({ width: 0, height: 0 });

  const tilesSize = {
    width: TILE_SIZE.width + 2 + TILE_WIDTH,
    height: TILE_SIZE.height + STEP_TILE_HEIGHT + TILE_WIDTH,
  };

  useEffect(() => {
    const size = textContainerRef.current?.getSize?.();
    if (!size) return;

    setTextSize(size);
  }, [setTextSize, selectedPreview]);

  const pivot = useMemo(
    () => ({
      x: tilesSize.width + 22,
      y: HOT_BAR_HEIGHT_FULL + tilesSize.height + 22,
    }),
    [tilesSize],
  );

  const renderType = useMemo(() => {
    switch (selectedPreview?.type) {
      case PrivateRoomPreviewType.CHARACTER:
        const user = selectedPreview.data as User;
        return (
          <CharacterComponent
            bodyAction={CharacterBodyAction.IDLE}
            bodyDirection={Direction.EAST}
            headDirection={Direction.EAST}
            leftArmAction={CharacterArmAction.IDLE}
            rightArmAction={CharacterArmAction.IDLE}
            skinColor={user.skinColor ?? 0xefcfb1}
            position={{ x: 0, y: 0 }}
          />
        );
      case PrivateRoomPreviewType.FRAME:
        return (
          <FurnitureFrameComponentWrapper
            position={{ x: 0, y: 0, z: 0 }}
            framePosition={{ x: 0, y: 0 }}
            data={selectedPreview.data as FurnitureData}
          />
        );
      case PrivateRoomPreviewType.FURNITURE:
        return (
          <FurnitureComponentWrapper
            position={{ x: 0, y: 0, z: 0 }}
            data={selectedPreview.data as FurnitureData}
          />
        );
    }
    return null;
  }, [selectedPreview]);

  if (!selectedPreview) return null;

  return (
    <ContainerComponent pivot={pivot}>
      <ContainerComponent>
        <TileComponent position={{ x: 0, y: 0 }} />
        <TileComponent position={{ x: TILE_WIDTH, y: TILE_WIDTH / 2 }} />
        <TileComponent position={{ x: -TILE_WIDTH, y: TILE_WIDTH / 2 }} />
        <TileComponent position={{ x: 0, y: TILE_WIDTH }} />
      </ContainerComponent>
      <ContainerComponent pivot={{ x: 0, y: -TILE_WIDTH / 2 }}>
        {renderType}
      </ContainerComponent>
      <ContainerComponent
        pivot={{
          x: -TILE_WIDTH * 2 + textSize.width / 2,
          y: -tilesSize.height - 5,
        }}
      >
        <TextComponent
          ref={textContainerRef}
          text={selectedPreview.title}
          horizontalAlign={HorizontalAlign.CENTER}
          {...TEXT_BACKGROUND_BASE}
        />
      </ContainerComponent>
    </ContainerComponent>
  );
};
