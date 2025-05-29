import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ContainerComponent,
  ContainerRef,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
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
  ButtonComponent,
  CharacterComponent,
  FurnitureComponent,
  FurnitureFrameComponent,
  TextComponent,
} from "shared/components";
import {
  CharacterArmAction,
  CharacterBodyAction,
  Direction,
  Event,
  PrivateRoomPreviewType,
  SpriteSheetEnum,
} from "shared/enums";
import { useAccount, usePrivateRoom, useProxy } from "shared/hooks";

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

const MARGIN = 22;

export const SelectionPreviewComponent: React.FC = () => {
  const textContainerRef = useRef<ContainerRef>(null);

  const { getAccount } = useAccount();
  const { selectedPreview, room } = usePrivateRoom();
  const { emit } = useProxy();

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
      x: tilesSize.width + MARGIN,
      y: HOT_BAR_HEIGHT_FULL + tilesSize.height + MARGIN + 20,
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
          <FurnitureFrameComponent
            position={{ x: 0, y: 0, z: 0 }}
            framePosition={{ x: 0, y: 0 }}
            furnitureId={(selectedPreview.data as FurnitureData).furnitureId}
          />
        );
      case PrivateRoomPreviewType.FURNITURE:
        return (
          <FurnitureComponent
            position={{ x: 0, y: 0, z: 0 }}
            furnitureId={(selectedPreview.data as FurnitureData).furnitureId}
          />
        );
    }
    return null;
  }, [selectedPreview]);

  const onRotateFurniture = useCallback(() => {
    emit(Event.ROTATE_FURNITURE, {
      id: selectedPreview.id,
    });
  }, [selectedPreview, emit]);

  const renderActions = useMemo(() => {
    const account = getAccount();
    const isRoomOwner = account.accountId === room?.ownerId;

    switch (selectedPreview?.type) {
      case PrivateRoomPreviewType.CHARACTER:
        return null;
      case PrivateRoomPreviewType.FRAME:
        return null;
      case PrivateRoomPreviewType.FURNITURE:
        return isRoomOwner ? (
          <>
            <ButtonComponent text="move" autoWidth />
            <ButtonComponent
              text="rotate"
              autoWidth
              onPointerDown={onRotateFurniture}
            />
            <ButtonComponent text="pick up" autoWidth />
          </>
        ) : null;
    }
    return null;
  }, [selectedPreview, room, getAccount, onRotateFurniture]);

  if (!selectedPreview) return null;

  return (
    <>
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
            x: -TILE_WIDTH * 2,
            y: -tilesSize.height - 5,
          }}
        >
          <ContainerComponent
            pivot={{
              x: textSize.width / 2,
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
      </ContainerComponent>
      <FlexContainerComponent
        pivot={{
          x: MARGIN + 200,
          y: HOT_BAR_HEIGHT_FULL + 10 + 10,
        }}
        size={{
          width: 200,
        }}
        gap={4}
        justify={FLEX_JUSTIFY.END}
      >
        {renderActions}
      </FlexContainerComponent>
    </>
  );
};
