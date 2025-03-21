import React, { useCallback, useEffect } from "react";
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
  const { load: loadFurniture } = useFurniture();
  const {
    room,
    users,
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
    loadFurniture(...room.furniture.map((furniture) => furniture.furnitureId));
  }, [room, loadFurniture]);

  if (!room) return null;

  return (
    <ContainerComponent>
      <FlexContainerComponent>
        <PrivateRoomComp {...room} onPointerTile={onPointerTile}>
          {users.map((user) => (
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
          {room.furniture.map((furniture) => (
            <FurnitureComponent key={furniture.id} {...furniture} />
          ))}
        </PrivateRoomComp>
      </FlexContainerComponent>
      <ChatHotBarComponent />
    </ContainerComponent>
  );
};
