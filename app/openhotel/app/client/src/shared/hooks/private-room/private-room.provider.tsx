import React, { ReactNode, useCallback } from "react";
import { PrivateRoomContext } from "./private-room.context";
import { useRoom } from "shared/hooks";
import { PrivateRoom, RoomFurniture } from "shared/types";

type PrivateRoomProps = {
  children: ReactNode;
};

export const PrivateRoomProvider: React.FunctionComponent<PrivateRoomProps> = ({
  children,
}) => {
  const { room, updateRoom } = useRoom<PrivateRoom>();

  const $addFurniture = useCallback(
    (furniture: RoomFurniture) =>
      updateRoom({
        ...room,
        furniture: [...room.furniture, furniture],
      }),
    [room, updateRoom],
  );
  const $removeFurniture = useCallback(
    (furniture: RoomFurniture) =>
      updateRoom({
        ...room,
        furniture: Array.isArray(furniture)
          ? room.furniture.filter(
              ($furniture) =>
                !furniture.map((furni) => furni.id).includes($furniture.id),
            )
          : room.furniture.filter(
              ($furniture) => $furniture.id !== furniture.id,
            ),
      }),
    [room, updateRoom],
  );
  const $updateFurniture = useCallback(
    (furniture: RoomFurniture) =>
      updateRoom({
        ...room,
        furniture: room.furniture.map(($furniture) =>
          $furniture.id === furniture.id ? furniture : $furniture,
        ),
      }),
    [room, updateRoom],
  );

  return (
    <PrivateRoomContext.Provider
      value={{
        addFurniture: $addFurniture,
        removeFurniture: $removeFurniture,
        updateFurniture: $updateFurniture,
      }}
      children={children}
    />
  );
};
