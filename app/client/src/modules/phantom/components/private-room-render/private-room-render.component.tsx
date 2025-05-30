import { useFurniture } from "shared/hooks";
import React, { useEffect, useMemo, useState } from "react";
import {
  CharacterArmAction,
  CharacterBodyAction,
  FurnitureType,
} from "shared/enums";
import {
  CharacterComponent,
  FurnitureComponent,
  FurnitureFrameComponent,
  PrivateRoomComponent,
} from "shared/components";
import { RoomFurnitureFrame } from "shared/types";
import { getPositionFromIsometricPosition, getZIndex } from "shared/utils";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
  useWindow,
} from "@openhotel/pixi-components";

export const PrivateRoomRenderComponent = () => {
  const { load: loadFurniture } = useFurniture();
  const { getSize } = useWindow();

  const [room, setRoom] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pivotFix, setPivotFix] = useState<boolean>(true);

  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoom((room) => {
        if (room) clearInterval(interval);
        return room ?? JSON.parse(localStorage.getItem("room"));
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!room) return;

    setPosition({
      x: parseInt(params.get("posX") ?? "0"),
      y: parseInt(params.get("posY") ?? "0"),
    });
    setPivotFix(params.get("pivotFix") !== "false");
  }, [room, setPosition, setPivotFix, params]);

  useEffect(() => {
    if (!room) return;
    loadFurniture(
      ...room.furniture.map((furniture) => furniture.furnitureId),
    ).then(() => {
      const meta = document.createElement("meta");
      meta.httpEquiv = "X-PHANTOM-LOADING-STATE";
      meta.content = "DONE";
      document.head.append(meta);
    });
  }, [room, loadFurniture]);

  const renderFurniture = useMemo(
    () =>
      room?.furniture?.map((furniture) =>
        furniture.type === FurnitureType.FURNITURE ? (
          <FurnitureComponent
            key={furniture.id}
            id={furniture.id}
            position={furniture.position}
            furnitureId={furniture.furnitureId}
            direction={furniture?.direction}
          />
        ) : (
          <FurnitureFrameComponent
            key={furniture.id}
            id={furniture.id}
            position={furniture.position}
            furnitureId={furniture.furnitureId}
            direction={furniture?.direction}
            framePosition={(furniture as RoomFurnitureFrame)?.framePosition}
            roomLayout={room?.layout}
          />
        ),
      ),
    [room?.furniture, room?.layout],
  );

  const renderCharacters = useMemo(
    () =>
      room?.users?.map((user) => (
        <CharacterComponent
          key={user.accountId}
          bodyAction={CharacterBodyAction.IDLE}
          bodyDirection={user.bodyDirection}
          headDirection={user.bodyDirection}
          leftArmAction={CharacterArmAction.IDLE}
          rightArmAction={CharacterArmAction.IDLE}
          skinColor={0xefcfb1}
          position={getPositionFromIsometricPosition(user.position)}
          zIndex={getZIndex(user.position, 0.5)}
        />
      )),
    [room?.users],
  );

  const size = useMemo(() => getSize(), [getSize]);

  if (!room) return;
  return (
    <ContainerComponent position={position}>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width}
        height={size.height}
        tint={0}
      />
      <PrivateRoomComponent {...room} pivotFix={pivotFix}>
        {renderFurniture}
        {renderCharacters}
      </PrivateRoomComponent>
    </ContainerComponent>
  );
};
