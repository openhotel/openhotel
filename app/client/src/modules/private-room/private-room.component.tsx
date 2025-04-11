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
import { useAccount, useCamera, usePrivateRoom, useProxy } from "shared/hooks";
import { Point2d, Point3d, Size2d } from "shared/types";
import {
  CrossDirection,
  Direction,
  Event as ProxyEvent,
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
  const { room, setSelectedPreview, selectedPreview } = usePrivateRoom();
  const { lastUpdate, update } = useUpdate();
  const { isDragging, position: cameraPosition } = useCamera();

  const { on: onEvent } = useEvents();
  const { getSize } = useWindow();
  const [windowSize, setWindowSize] = useState<Size>(getSize());
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

  const roomPosition = useMemo(() => {
    if (!roomSize) return { x: 0, y: 0 };
    return {
      x: (windowSize.width - roomSize.width) / 2,
      y: (windowSize.height - roomSize.height - HOT_BAR_HEIGHT_FULL) / 2,
    };
  }, [windowSize, lastUpdate, roomSize]);

  const currentAccountId = useMemo(() => getAccount().accountId, [getAccount]);
  const currentUser = useMemo(
    () => room?.users?.find((user) => user.accountId === currentAccountId),
    [room?.users, currentAccountId],
  );

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
    if (!room) return;

    const onRemoveOnResize = onEvent(Event.RESIZE, setWindowSize);
    setWindowSize(getSize());

    setRoomSize(privateRoomRef.current.getSize());
    setRoomPivot(privateRoomRef.current.pivot);

    update();

    return () => {
      onRemoveOnResize();
    };
  }, [onEvent, update, room?.id, setRoomSize]);

  const onPointerTile = useCallback(
    (position: Point3d) => {
      if (isDragging) return;

      emit(ProxyEvent.POINTER_TILE, {
        position,
      });
      setSelectedPreview(null);
    },
    [emit, setSelectedPreview, isDragging],
  );

  const onHoverTile = useCallback(
    (data: PreviewTileData) => {
      setHoverTileData(data);
    },
    [setHoverTileData],
  );

  const onClickWall = useCallback(
    (position: Point3d, point: Point2d, direction: CrossDirection) => {
      setWallDataPoint([position, point, direction]);
      setSelectedPreview(null);
    },
    [setWallDataPoint, setSelectedPreview],
  );

  const messagesPivot = useMemo(
    () => ({
      x: roomPivot.x,
      y: roomPosition.y + cameraPosition.y,
    }),
    [roomPosition, roomPivot, cameraPosition],
  );

  if (!room) return null;

  return (
    <ContainerComponent>
      <CameraComponent
        margin={100}
        contentRef={privateRoomRef}
        bottomPadding={HOT_BAR_HEIGHT_FULL}
      >
        <ContainerComponent position={roomPosition}>
          <PrivateRoomComp
            ref={privateRoomRef}
            {...room}
            onPointerTile={onPointerTile}
            onHoverTile={onHoverTile}
            onClickWall={onClickWall}
          >
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
      <ContainerComponent position={{ y: windowSize.height }}>
        <RoomInfoComponent />
        <ChatHotBarComponent width={windowSize.width} />
        <ContainerComponent position={{ x: windowSize.width }}>
          <SelectionPreviewComponent />
        </ContainerComponent>
      </ContainerComponent>
    </ContainerComponent>
  );
};
