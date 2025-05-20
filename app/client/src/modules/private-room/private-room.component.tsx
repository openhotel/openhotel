import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CameraComponent,
  PreviewTileData,
  PrivateRoomComponent as PrivateRoomComp,
} from "shared/components";

import {
  ContainerComponent,
  ContainerRef,
  Event,
  Size,
  useEvents,
  useUpdate,
  useWindow,
} from "@openhotel/pixi-components";
import {
  PositionData,
  useAccount,
  useCamera,
  useItemPlacePreview,
  useModal,
  usePrivateRoom,
  useProxy,
  useSafeWindow,
} from "shared/hooks";
import { Point2d, Point3d, Size2d } from "shared/types";
import {
  CrossDirection,
  Direction,
  Event as ProxyEvent,
  InternalEvent,
  Modal,
  PrivateRoomPreviewType,
} from "shared/enums";
import {
  ChatHotBarComponent,
  RoomCharactersComponent,
  RoomFurnitureComponent,
  RoomInfoComponent,
  RoomMessagesComponent,
  SelectionPreviewComponent,
} from ".";
import { HOT_BAR_HEIGHT_FULL } from "shared/consts";
import { useInfo } from "shared/hooks/info";
import { getCrossDirectionFromDirection, getDirection } from "shared/utils";

type Props = {};

export const PrivateRoomComponent: React.FC<Props> = () => {
  const privateRoomRef = useRef<ContainerRef>(null);

  const { getAccount } = useAccount();
  const { setExtra } = useInfo();
  const { emit } = useProxy();
  const {
    room,
    setSelectedPreview,
    selectedPreview,
    setLastPositionData,
    setAbsoluteRoomPosition,
  } = usePrivateRoom();
  const { lastUpdate, update } = useUpdate();
  const { isDragging, position: cameraPosition } = useCamera();

  const { on: onEvent, emit: emitEvent } = useEvents();
  const { getSize, getScale } = useWindow();
  const { getSafeSize } = useSafeWindow();
  const { openModal } = useModal();

  const {
    renderPreviewItem,
    setCanPlace,
    getPreviewItemId,
    setItemPreviewData,
  } = useItemPlacePreview();

  const [isShiftDown, setIsShiftDown] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<Size>(getSize());
  const [safeWindowSize, setSafeWindowSize] = useState<Size>(getSafeSize());
  const [roomSize, setRoomSize] = useState<Size2d>({
    width: 0,
    height: 0,
  });
  const [roomPivot, setRoomPivot] = useState<Point2d>({
    x: 0,
    y: 0,
  });

  const [hoverTileData, setHoverTileData] = useState<PreviewTileData | null>(
    null,
  );
  const [wallDataPoint, setWallDataPoint] = useState<
    [Point3d, Point2d, CrossDirection] | [null, null]
  >([null, null]);

  const renderPreviewVisibleRef = useRef(false);

  const roomPosition = useMemo(() => {
    if (!roomSize) return { x: 0, y: 0 };
    return {
      x: Math.round((windowSize.width - roomSize.width) / 2),
      y: Math.round(
        (windowSize.height - roomSize.height) / 2 -
          HOT_BAR_HEIGHT_FULL / getScale(),
      ),
    };
  }, [windowSize, lastUpdate, roomSize, getScale]);

  const currentAccountId = useMemo(() => getAccount().accountId, [getAccount]);
  const currentUser = useMemo(
    () => room?.users?.find((user) => user.accountId === currentAccountId),
    [room?.users, currentAccountId],
  );

  useEffect(() => {
    setCanPlace(room?.ownerId === currentAccountId);

    return () => {
      setCanPlace(false);
    };
  }, [setCanPlace, currentAccountId, room]);

  useEffect(() => {
    if (!room) return;

    const cursorDirection = hoverTileData
      ? getDirection(currentUser.position, hoverTileData.point)
      : Direction.NONE;
    const crossDirection = getCrossDirectionFromDirection(cursorDirection);

    setExtra([
      `${room.users.map((user) => user.username).join(", ")} (${room.users.length})`,
      null,
      `furniture (${room.furniture.length})`,
      null,
      [
        `x:${currentUser.position.x} y:${currentUser.position.y} z:${currentUser.position.z}`,
        `// ${[Direction[currentUser.bodyDirection]]}[${currentUser.bodyDirection}]`,
        ` <<< USER`,
      ].join(" "),
      [
        `x:${hoverTileData?.point?.x ?? 0} y:${hoverTileData?.point?.y ?? 0} z:${hoverTileData?.point?.z ?? 0}`,
        `// ${hoverTileData?.type ?? "null"} (${CrossDirection[hoverTileData?.direction] ?? "NONE"}[${hoverTileData?.direction ?? -1}])`,
        `< CURSOR`,
      ].join(" "),
      [
        `abs ${Direction[cursorDirection]}[${cursorDirection}]`,
        `// cross ${CrossDirection[crossDirection] ?? "NONE"}[${crossDirection ?? -1}]`,
        `<<<< U<>C`,
      ].join(" "),

      [
        `x:${wallDataPoint[0]?.x ?? 0} y:${wallDataPoint[0]?.y ?? 0} z:${wallDataPoint[0]?.z ?? 0}`,
        `// ${CrossDirection[wallDataPoint[2]] ?? "NONE"}[${wallDataPoint[2] ?? -1}]`,
        `// wallX:${wallDataPoint[1]?.x ?? 0} wallY:${wallDataPoint[1]?.y ?? 0}`,
        `<<  WALL`,
      ].join(" "),
      null,
      selectedPreview
        ? [
            PrivateRoomPreviewType[selectedPreview.type],
            selectedPreview.title,
            selectedPreview.id,
          ].join(" ")
        : null,
    ]);
  }, [
    room,
    setExtra,
    roomPosition,
    hoverTileData,
    currentUser,
    wallDataPoint,
    selectedPreview,
  ]);

  useEffect(() => {
    const absolutePosition = {
      x: roomPosition.x + cameraPosition.x,
      y: roomPosition.y + cameraPosition.y,
    };
    setAbsoluteRoomPosition(absolutePosition);
  }, [cameraPosition, roomPosition, setAbsoluteRoomPosition]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code.includes("Shift")) setIsShiftDown(true);
    },
    [setIsShiftDown],
  );

  const onKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.code.includes("Shift")) setIsShiftDown(false);
    },
    [setIsShiftDown],
  );

  useEffect(() => {
    if (!room) return;

    const onRemoveOnResize = onEvent(Event.RESIZE, setWindowSize);
    const onRemoveOnSafeResize = onEvent(
      InternalEvent.SAFE_RESIZE,
      setSafeWindowSize,
    );
    const onRemoveKeyDown = onEvent(Event.KEY_DOWN, onKeyDown);
    const onRemoveKeyUp = onEvent(Event.KEY_UP, onKeyUp);
    setWindowSize(getSize());

    setRoomSize(privateRoomRef.current.getSize());
    setRoomPivot(privateRoomRef.current.pivot);

    update();

    return () => {
      onRemoveOnResize();
      onRemoveOnSafeResize();
      onRemoveKeyDown();
      onRemoveKeyUp();
    };
  }, [onEvent, update, room?.id, setRoomSize, onKeyDown, onKeyUp]);

  const onPointerTile = useCallback(
    (position: Point3d) => {
      if (isDragging()) return;

      if (isShiftDown) {
        setLastPositionData({
          position,
          direction: CrossDirection.NORTH,
        });
        return;
      }

      if (renderPreviewItem) return;

      emit(ProxyEvent.POINTER_TILE, {
        position,
      });
      setSelectedPreview(null);
    },
    [
      emit,
      setSelectedPreview,
      isDragging,
      isShiftDown,
      setLastPositionData,
      renderPreviewItem,
      getPreviewItemId,
      setItemPreviewData,
    ],
  );

  const onHoverTile = useCallback(
    (data: PreviewTileData) => {
      setHoverTileData(data);
      emitEvent(InternalEvent.HOVER_TILE, data);
    },
    [setHoverTileData, emitEvent],
  );

  const onMoveWall = useCallback(
    (position: Point3d, wallPosition: Point2d, direction: CrossDirection) => {
      const data: PositionData = {
        position,
        wallPosition,
        direction,
      };
      setLastPositionData(data);
      setWallDataPoint([position, wallPosition, direction]);
      emitEvent(InternalEvent.HOVER_WALL, data);
    },
    [setWallDataPoint, setSelectedPreview, setLastPositionData],
  );

  const messagesPivot = useMemo(() => {
    return {
      x: roomPivot.x,
      y: roomPosition.y + cameraPosition.y,
    };
  }, [roomPosition, roomPivot, cameraPosition]);

  const safeXPosition = useMemo(
    () => Math.round((windowSize.width - safeWindowSize.width) / 2),
    [windowSize, safeWindowSize],
  );

  //reopen inventory when items are out
  useEffect(() => {
    if (renderPreviewItem) {
      renderPreviewVisibleRef.current = true;
      return;
    }
    if (!renderPreviewVisibleRef.current) return;

    openModal(Modal.INVENTORY);
    renderPreviewVisibleRef.current = false;
  }, [renderPreviewItem, openModal]);

  return useMemo(
    () =>
      room ? (
        <ContainerComponent>
          <CameraComponent
            margin={50}
            contentRef={privateRoomRef}
            bottomPadding={HOT_BAR_HEIGHT_FULL}
          >
            <ContainerComponent position={roomPosition}>
              <PrivateRoomComp
                ref={privateRoomRef}
                {...room}
                onPointerTile={onPointerTile}
                onHoverTile={onHoverTile}
                onMoveWall={onMoveWall}
              >
                {renderPreviewItem}
                <RoomCharactersComponent />
                <RoomFurnitureComponent />
              </PrivateRoomComp>
              <RoomMessagesComponent pivot={messagesPivot} />
            </ContainerComponent>
            {/*<GraphicsComponent*/}
            {/*  type={GraphicType.RECTANGLE}*/}
            {/*  width={roomSize.width}*/}
            {/*  height={roomSize.height}*/}
            {/*  position={roomPosition}*/}
            {/*  alpha={0.5}*/}
            {/*  eventMode={EventMode.NONE}*/}
            {/*/>*/}
          </CameraComponent>
          <ContainerComponent
            position={{
              x: safeXPosition,
              y: windowSize.height,
            }}
          >
            <RoomInfoComponent />
            <ChatHotBarComponent
              maxWidth={windowSize.width}
              width={safeWindowSize.width}
            />
            <ContainerComponent position={{ x: safeWindowSize.width }}>
              <SelectionPreviewComponent />
            </ContainerComponent>
          </ContainerComponent>
        </ContainerComponent>
      ) : null,
    [
      room,
      windowSize,
      roomPosition,
      safeWindowSize,
      safeXPosition,
      onPointerTile,
      onHoverTile,
      onMoveWall,
      messagesPivot,
      renderPreviewItem,
    ],
  );
};
