import React, { useCallback, useEffect, useState } from "react";
import { NavigatorRoomButtonComponent } from "shared/components";
import {
  ContainerComponent,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  NineSliceSpriteComponent,
  ScrollableContainerComponent,
  Size,
  SpriteComponent,
  TilingSpriteComponent,
} from "@openhotel/pixi-components";
import { ModalNavigatorTabProps } from "shared/types";
import { useApi, useProxy } from "shared/hooks";
import { Event, SpriteSheetEnum } from "shared/enums";

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

const scrollSize = 75;

export const CategoryRoomsComponentWrapper: React.FC<Props> = ({
  size,
  rooms,
  onClickGo,
  onClickFavorite,
}) => {
  if (!rooms.length) return null;

  return (
    <ScrollableContainerComponent
      size={{
        width: size.width - 11,
        height: size.height,
      }}
      scrollbar={{
        renderTop: () => (
          <SpriteComponent
            texture="scrollbar-arrow-top"
            spriteSheet={SpriteSheetEnum.UI}
          />
        ),
        renderBottom: () => (
          <SpriteComponent
            texture="scrollbar-arrow-bottom"
            spriteSheet={SpriteSheetEnum.UI}
          />
        ),
        renderScrollBackground: () => (
          <TilingSpriteComponent
            texture="scrollbar-background"
            spriteSheet={SpriteSheetEnum.UI}
            height={size.height - 22}
          />
        ),
        renderScrollBar: () => (
          <ContainerComponent>
            <NineSliceSpriteComponent
              texture="scrollbar-scroll-bar"
              spriteSheet={SpriteSheetEnum.UI}
              leftWidth={4}
              rightWidth={4}
              topHeight={4}
              bottomHeight={4}
              height={scrollSize}
            />
            <TilingSpriteComponent
              texture="scrollbar-scroll-bar-background"
              spriteSheet={SpriteSheetEnum.UI}
              height={scrollSize - 6}
              position={{
                x: 2,
                y: 3,
              }}
            />
          </ContainerComponent>
        ),
      }}
    >
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
    </ScrollableContainerComponent>
  );
};
