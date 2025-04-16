import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  NavigatorRoomButtonComponent,
  ScrollComponent,
} from "shared/components";
import {
  FLEX_JUSTIFY,
  FlexContainerComponent,
  Size,
} from "@openhotel/pixi-components";
import { ModalNavigatorTabProps } from "shared/types";
import { useApi, useProxy } from "shared/hooks";
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
  const { fetch } = useApi();
  const { emit } = useProxy();

  const [rooms, setRooms] = useState([]);

  const $reload = useCallback(() => {
    fetch("/room-list", {
      type: "private",
    }).then(
      ({
        rooms,
      }: {
        rooms: {
          id: string;
          title: string;
          description: string;
          userCount: number;
          maxUsers: number;
        }[];
      }) => {
        setRooms(
          rooms.map((room) => ({
            id: room.id,
            title: room.title,
            users: room.userCount,
            maxUsers: room.maxUsers,
          })),
        );
      },
    );
  }, [setRooms, fetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      $reload();
    }, 30_000);
    $reload();

    return () => {
      clearInterval(interval);
    };
  }, [$reload]);

  const onClickGo = useCallback(
    (roomId: string) => {
      emit(Event.PRE_JOIN_ROOM, {
        roomId,
      });
      $reload();
    },
    [$reload],
  );

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
  if (!rooms.length) return null;

  const content = useMemo(
    () => (
      <FlexContainerComponent
        justify={FLEX_JUSTIFY.START}
        direction="y"
        gap={3}
      >
        {rooms.map(({ id, title, users, maxUsers, favorite }, index) => (
          <NavigatorRoomButtonComponent
            key={id}
            size={{
              width: size.width - 11 - 5,
              height: 11 + 5,
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
    ),
    [rooms, size, onClickGo, onClickFavorite],
  );

  return (
    <ScrollComponent
      size={{
        width: size.width - 13,
        height: size.height,
      }}
      children={content}
    />
  );
};
