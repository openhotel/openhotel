import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CharacterComponent } from "shared/components";
import {
  CharacterArmAction,
  CharacterBodyAction,
  Event as ProxyEvent,
  PrivateRoomPreviewType,
} from "shared/enums";
import { usePrivateRoom, useProxy } from "shared/hooks";
import { Point3d, User } from "shared/types";
import {
  CHARACTER_WALK_FRAME_DURATION_MS,
  CHARACTER_WALK_FRAMES,
} from "shared/consts";

type UserData = {
  position?: Point3d;
  bodyAction?: CharacterBodyAction;
  animationId?: number;
  isWalking?: boolean;
  latestTarget?: Point3d;
};

export const RoomCharactersComponent: React.FC = () => {
  const { on } = useProxy();
  const {
    room,
    addUser,
    removeUser,
    setUserPosition,
    setSelectedPreview,
    setUserBodyDirection,
  } = usePrivateRoom();

  const [usersData, setUsersData] = useState<{ [key: string]: UserData }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setUsersData((prev) => {
        const updated = { ...prev };

        Object.entries(prev).forEach(([accountId, data]) => {
          if (data.isWalking) {
            const currentIndex = CHARACTER_WALK_FRAMES.indexOf(
              data.bodyAction ?? CharacterBodyAction.WALK_0,
            );
            const nextIndex = (currentIndex + 1) % CHARACTER_WALK_FRAMES.length;

            updated[accountId] = {
              ...data,
              bodyAction: CHARACTER_WALK_FRAMES[nextIndex],
            };
          }
        });

        return updated;
      });
    }, CHARACTER_WALK_FRAME_DURATION_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!room) return;

    const removeOnAddHuman = on(ProxyEvent.ADD_HUMAN, ({ user }) => {
      addUser(user);
    });

    const removeOnRemoveHuman = on(ProxyEvent.REMOVE_HUMAN, ({ accountId }) => {
      removeUser(accountId);
    });

    const removeOnMoveHuman = on(
      ProxyEvent.MOVE_HUMAN,
      ({ accountId, position, bodyDirection }) => {
        const user = room.users.find((u) => u.accountId === accountId);
        if (!user) return;

        const currentPosition =
          usersData[accountId]?.latestTarget ?? user.position;
        setUserBodyDirection(accountId, bodyDirection);
        animateMove(accountId, currentPosition, position);
      },
    );

    const removeOnSetPositionHuman = on(
      ProxyEvent.SET_POSITION_HUMAN,
      ({ accountId, position }) => {
        setUserPosition(accountId, position);
      },
    );

    return () => {
      removeOnAddHuman();
      removeOnRemoveHuman();
      removeOnMoveHuman();
      removeOnSetPositionHuman();
    };
  }, [
    room,
    on,
    addUser,
    removeUser,
    setUserPosition,
    setUserBodyDirection,
    usersData,
  ]);

  const onPointerDown = useCallback(
    (user: User) => () => {
      setSelectedPreview({
        id: user.accountId,
        type: PrivateRoomPreviewType.CHARACTER,
        data: user,
        title: user.username,
      });
    },
    [setSelectedPreview],
  );

  const animateMove = (accountId: string, from: Point3d, to: Point3d) => {
    const userData = usersData[accountId] ?? {};
    if (userData.animationId) cancelAnimationFrame(userData.animationId);

    const duration = 504;
    const start = performance.now();

    const loop = (time: number) => {
      const elapsed = time - start;
      const t = Math.min(elapsed / duration, 1);

      const lerped: Point3d = {
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
        z: from.z + (to.z - from.z) * t,
      };

      setUsersData((prev) => ({
        ...prev,
        [accountId]: {
          ...prev[accountId],
          position: lerped,
          latestTarget: to,
          isWalking: true,
        },
      }));

      if (t < 1) {
        const animationId = requestAnimationFrame(loop);
        setUsersData((prev) => ({
          ...prev,
          [accountId]: {
            ...prev[accountId],
            animationId,
          },
        }));
      } else {
        setUserPosition(accountId, to);
        setUsersData((prev) => ({
          ...prev,
          [accountId]: {
            latestTarget: to,
            isWalking: false,
            bodyAction: CharacterBodyAction.IDLE,
            animationId: undefined,
            position: undefined,
          },
        }));
      }
    };

    const animationId = requestAnimationFrame(loop);
    setUsersData((prev) => ({
      ...prev,
      [accountId]: {
        ...prev[accountId],
        animationId,
        isWalking: true,
        latestTarget: to,
      },
    }));
  };

  return useMemo(
    () =>
      room.users.map((user) => {
        const userData = usersData[user.accountId] ?? {};

        return (
          <CharacterComponent
            key={user.accountId}
            bodyAction={userData.bodyAction}
            bodyDirection={user.bodyDirection}
            headDirection={user.bodyDirection}
            leftArmAction={CharacterArmAction.IDLE}
            rightArmAction={CharacterArmAction.IDLE}
            skinColor={user.skinColor ?? 0xefcfb1}
            position={userData.position ?? user.position}
            onPointerDown={onPointerDown(user)}
          />
        );
      }),
    [room.users, usersData],
  );
};
