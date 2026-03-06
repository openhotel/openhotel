import React, { useCallback, useMemo } from "react";
import { RoomCharacterComponent } from "../";
import { PrivateRoomPreviewType } from "shared/enums";
import { useRoom } from "shared/hooks";
import { PrivateRoom, User } from "shared/types";

type Props = {
  disableHitAreas?: boolean;
};

export const RoomCharactersComponent: React.FC<Props> = ({
  disableHitAreas = false,
}) => {
  const { room, setSelectedPreview } = useRoom<PrivateRoom>();

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

  return useMemo(
    () =>
      room.users.map((user) => (
        <RoomCharacterComponent
          key={user.accountId}
          user={user}
          onPointerDown={onPointerDown(user)}
          disableHitArea={disableHitAreas}
        />
      )),
    [room.users, disableHitAreas],
  );
};
