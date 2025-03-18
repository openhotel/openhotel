import React, { useCallback, useEffect, useState } from "react";
import { NavigatorRoomButtonComponent } from "shared/components";
import {
  FLEX_JUSTIFY,
  FlexContainerComponent,
  Size,
} from "@oh/pixi-components";
import { ModalNavigatorTabProps } from "shared/types";
import { System } from "system";
import { useProxy } from "shared/hooks";
import { Event } from "shared/enums";

type Props = {
  size: Size;

  rooms: {
    id: string;
    title: string;
    users: number;
    maxUsers: number;
    favorite: boolean;
  }[];

  onClickFavorite: (roomId: string) => void;
  onClickGo: (roomId: string) => void;
};

export const CategoryRoomsComponent: React.FC<ModalNavigatorTabProps> = ({
  size,
}) => {
  const { emit } = useProxy();

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    System.api
      .fetch<{
        rooms: {
          id: string;
          title: string;
          description: string;
          userCount: number;
          maxUsers: number;
        }[];
      }>("/room-list", {
        type: "private",
      })
      .then(({ rooms }) => {
        setRooms(
          rooms.map((room) => ({
            id: room.id,
            title: room.title,
            users: room.userCount,
            maxUsers: room.maxUsers,
          })),
        );
      });
  }, [setRooms]);

  const onClickGo = useCallback((roomId: string) => {
    emit(Event.PRE_JOIN_ROOM, {
      roomId,
    });
  }, []);

  const onClickFavorite = useCallback(() => {}, []);

  return (
    <CategoryRoomsComponentWrapper
      size={size}
      rooms={rooms}
      onClickGo={onClickGo}
      onClickFavorite={onClickFavorite}
    />
  );
};

export const CategoryRoomsComponentWrapper: React.FC<Props> = ({
  size,
  rooms,
  onClickGo,
  onClickFavorite,
}) => {
  return (
    <FlexContainerComponent justify={FLEX_JUSTIFY.START} direction="y" gap={3}>
      {rooms.map(({ id, title, users, maxUsers, favorite }, index) => (
        <NavigatorRoomButtonComponent
          key={id}
          size={{
            width: size.width,
            height: 16,
          }}
          title={title}
          users={users}
          maxUsers={maxUsers}
          favorite={favorite}
          onClickFavorite={() => onClickFavorite(id)}
          onClickGo={() => onClickGo(id)}
        />
      ))}
    </FlexContainerComponent>
  );
};
