import React, { useCallback, useEffect, useMemo } from "react";
import {
  CharacterComponent,
  FurnitureComponent,
  PrivateRoomComponent as PrivateRoomComp,
} from "shared/components";

import {
  ContainerComponent,
  FlexContainerComponent,
} from "@oh/pixi-components";
import {
  useFurniture,
  usePrivateRoom,
  useProxy,
  useRouter,
} from "shared/hooks";
import { Point3d, RoomFurniture } from "shared/types";
import { CharacterArmAction, CharacterBodyAction, Event } from "shared/enums";
import { ChatHotBarComponent } from "modules/private-room";

type Props = {};

export const PrivateRoomComponent: React.FC<Props> = () => {
  const { on, emit } = useProxy();
  const { navigate } = useRouter();
  const { load: loadFurniture, get: getFurniture } = useFurniture();
  const {
    room,
    addUser,
    removeUser,
    setUserPosition,
    addFurniture,
    removeFurniture,
    updateFurniture,
  } = usePrivateRoom();

  const onPointerTile = useCallback(
    (position: Point3d) => {
      emit(Event.POINTER_TILE, {
        position,
      });
    },
    [emit],
  );

  useEffect(() => {
    if (!room) return;

    const removeOnAddHuman = on(Event.ADD_HUMAN, ({ user }) => {
      addUser(user);
    });
    const removeOnRemoveHuman = on(Event.REMOVE_HUMAN, ({ accountId }) => {
      removeUser(accountId);
    });

    const removeOnMoveHuman = on(
      Event.MOVE_HUMAN,
      ({ accountId, position, bodyDirection }) => {
        setUserPosition(accountId, position, bodyDirection);
      },
    );

    const removeOnSetPositionHuman = on(
      Event.SET_POSITION_HUMAN,
      ({ accountId, position }) => {
        setUserPosition(accountId, position);
      },
    );

    const removeOnAddFurniture = on(
      Event.ADD_FURNITURE,
      ({ furniture }: { furniture: RoomFurniture }) => {
        addFurniture(furniture);
      },
    );

    const removeOnUpdateFurniture = on(
      Event.REMOVE_FURNITURE,
      ({ furniture }: { furniture: RoomFurniture }) => {
        removeFurniture(furniture);
      },
    );

    const removeOnRemoveFurniture = on(
      Event.REMOVE_FURNITURE,
      ({ furniture }: { furniture: RoomFurniture }) => {
        removeFurniture(furniture);
      },
    );

    return () => {
      removeOnAddHuman();
      removeOnRemoveHuman();
      removeOnMoveHuman();
      removeOnSetPositionHuman();
      removeOnAddFurniture();
      removeOnUpdateFurniture();
      removeOnRemoveFurniture();
    };
  }, [
    room,
    on,
    emit,
    navigate,
    addUser,
    removeUser,
    setUserPosition,
    addFurniture,
    updateFurniture,
    removeFurniture,
  ]);

  useEffect(() => {
    if (!room) return;
    loadFurniture(...room.furniture.map((furniture) => furniture.furnitureId));
  }, [room, loadFurniture]);

  const renderFurniture = useMemo(
    () =>
      room?.furniture?.map((furniture) => {
        const furnitureData = getFurniture(furniture.furnitureId);

        return (
          <FurnitureComponent
            key={furniture.id}
            id={furniture.id}
            position={furniture.position}
            furnitureId={furniture.furnitureId}
            spriteSheet={furnitureData?.spriteSheet}
            textures={furnitureData?.direction?.[furniture.direction]?.textures}
          />
        );
      }),
    [room, getFurniture],
  );

  if (!room) return null;

  return (
    <ContainerComponent>
      <FlexContainerComponent>
        <PrivateRoomComp {...room} onPointerTile={onPointerTile}>
          {room.users.map((user) => (
            <CharacterComponent
              key={user.accountId}
              bodyAction={CharacterBodyAction.IDLE}
              bodyDirection={user.bodyDirection}
              headDirection={user.bodyDirection}
              leftArmAction={CharacterArmAction.IDLE}
              rightArmAction={CharacterArmAction.IDLE}
              skinColor={user.skinColor ?? 0xefcfb1}
              position={user.position}
            />
          ))}
          {renderFurniture}
        </PrivateRoomComp>
      </FlexContainerComponent>
      <ChatHotBarComponent />
    </ContainerComponent>
  );
};
