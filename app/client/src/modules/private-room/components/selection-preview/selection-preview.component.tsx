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
import {
  useAccount,
  useItemPlacePreview,
  usePrivateRoom,
  useProxy,
} from "shared/hooks";
import { useTranslation } from "react-i18next";

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

const MARGIN = 10;

export const SelectionPreviewComponent: React.FC = () => {
  const textContainerRef = useRef<ContainerRef>(null);

  const { t } = useTranslation();
  const { setItemPreviewData } = useItemPlacePreview();
  const { getAccount } = useAccount();
  const { selectedPreview, room, setSelectedPreview } = usePrivateRoom();
  const { emit } = useProxy();

  const [textSize, setTextSize] = useState<Size2d>({ width: 0, height: 0 });

  const tilesSize = useMemo(
    () => ({
      width: TILE_SIZE.width + 2 + TILE_WIDTH,
      height: TILE_SIZE.height + STEP_TILE_HEIGHT + TILE_WIDTH,
    }),
    [],
  );

  const fullTileSizeWidth = useMemo(
    () => TILE_SIZE.width + 2 + TILE_WIDTH * 2,
    [],
  );

  useEffect(() => {
    const size = textContainerRef.current?.getSize?.();
    if (!size) return;

    setTextSize(size);
  }, [setTextSize, selectedPreview]);

  const pivot = useMemo(
    () => ({
      x: tilesSize.width + MARGIN,
      y: HOT_BAR_HEIGHT_FULL + tilesSize.height + MARGIN * 2 + 20,
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
        console.log(selectedPreview.data.size.height);
        return (
          <FurnitureFrameComponent
            position={{ x: 0, y: 0, z: 0 }}
            framePosition={{
              x: 0,
              y: selectedPreview.data.size.height - TILE_WIDTH * 2,
            }}
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

  const onPickUpFurniture = useCallback(() => {
    emit(Event.PICK_UP_FURNITURE, {
      id: selectedPreview.id,
    });
    setSelectedPreview(null);
  }, [selectedPreview, emit, setSelectedPreview]);

  const onMoveFurniture = useCallback(() => {
    setSelectedPreview(null);
    setItemPreviewData({
      type: "move",
      ids: [selectedPreview.id],
      direction: selectedPreview.direction,
      furnitureData: selectedPreview.data as FurnitureData,
    });
  }, [selectedPreview, emit, setSelectedPreview, setItemPreviewData]);

  const renderActions = useMemo(() => {
    const account = getAccount();
    const isRoomOwner = account.accountId === room?.ownerId;

    switch (selectedPreview?.type) {
      case PrivateRoomPreviewType.CHARACTER:
        return null;
      case PrivateRoomPreviewType.FRAME:
        return isRoomOwner ? (
          <>
            <ButtonComponent
              text={t("furniture.move")}
              autoWidth
              onPointerDown={onMoveFurniture}
            />
            <ButtonComponent
              text={t("furniture.pick_up")}
              autoWidth
              onPointerDown={onPickUpFurniture}
            />
          </>
        ) : null;
      case PrivateRoomPreviewType.FURNITURE:
        return isRoomOwner ? (
          <>
            <ButtonComponent
              text={t("furniture.move")}
              autoWidth
              onPointerDown={onMoveFurniture}
            />
            <ButtonComponent
              text={t("furniture.rotate")}
              autoWidth
              onPointerDown={onRotateFurniture}
            />
            <ButtonComponent
              text={t("furniture.pick_up")}
              autoWidth
              onPointerDown={onPickUpFurniture}
            />
          </>
        ) : null;
    }
    return null;
  }, [
    selectedPreview,
    room,
    getAccount,
    onRotateFurniture,
    onPickUpFurniture,
    t,
  ]);

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
      </ContainerComponent>
      <ContainerComponent
        pivot={{
          x: MARGIN,
          y: HOT_BAR_HEIGHT_FULL,
        }}
      >
        <ContainerComponent
          pivot={{
            y: 37,
          }}
        >
          <TextComponent
            pivot={{
              x:
                textSize.width > fullTileSizeWidth
                  ? textSize.width
                  : textSize.width / 2 + fullTileSizeWidth / 2,
            }}
            ref={textContainerRef}
            text={selectedPreview.title}
            horizontalAlign={HorizontalAlign.RIGHT}
            {...TEXT_BACKGROUND_BASE}
          />
        </ContainerComponent>
        <FlexContainerComponent
          pivot={{
            x: 200,
            y: MARGIN * 2,
          }}
          size={{
            width: 200,
          }}
          gap={4}
          justify={FLEX_JUSTIFY.END}
        >
          {renderActions}
        </FlexContainerComponent>
      </ContainerComponent>
    </>
  );
};
