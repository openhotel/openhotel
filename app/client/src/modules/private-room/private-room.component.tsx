import React, { useCallback, useEffect, useState } from "react";
import { PrivateRoomComponent as PrivateRoomComp } from "shared/components";

import {
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { useProxy } from "shared/hooks";
import { Point3d, PrivateRoom, User } from "shared/types";
import {
  CharacterArmAction,
  CharacterBodyAction,
  Direction,
  Event,
} from "shared/enums";
import { CharacterComponent } from "shared/components";
import { getPositionFromIsometricPosition } from "shared/utils";

type Props = {
  room: PrivateRoom;
};

export const PrivateRoomComponent: React.FC<Props> = ({ room }) => {
  const { emit, on } = useProxy();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const removeOnAddHuman = on(Event.ADD_HUMAN, ({ user }) => {
      setUsers((users) => [...users, user]);
    });
    const removeOnRemoveHuman = on(Event.REMOVE_HUMAN, ({ accountId }) => {
      setUsers((users) => users.filter((user) => user.accountId !== accountId));
    });
    const removeOnMoveHuman = on(
      Event.MOVE_HUMAN,
      ({ accountId, position }) => {
        setUsers((users) =>
          users.map((user) => {
            if (user.accountId !== accountId) return user;
            return {
              ...user,
              position,
            };
          }),
        );
      },
    );

    return () => {
      removeOnAddHuman();
      removeOnRemoveHuman();
      removeOnMoveHuman();
    };
  }, [on, setUsers]);

  const onPointerTile = useCallback(
    (position: Point3d) => {
      console.log(position);
      emit(Event.POINTER_TILE, {
        position,
      });
    },
    [emit],
  );

  console.log(users);
  return (
    <FlexContainerComponent
      justify={FLEX_JUSTIFY.CENTER}
      align={FLEX_ALIGN.CENTER}
    >
      <PrivateRoomComp {...room} onPointerTile={onPointerTile}>
        {users.map((user) => (
          <CharacterComponent
            key={user.accountId}
            bodyAction={CharacterBodyAction.SIT}
            bodyDirection={Direction.NORTH}
            headDirection={Direction.NORTH_EAST}
            leftArmAction={CharacterArmAction.ARM_WAVE_0}
            rightArmAction={CharacterArmAction.IDLE}
            skinColor={user.skinColor ?? 0xefcfb1}
            zIndex={user.position.x + user.position.z}
            position={getPositionFromIsometricPosition(user.position)}
          />
        ))}
      </PrivateRoomComp>
    </FlexContainerComponent>
  );
};
