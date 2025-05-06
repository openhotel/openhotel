import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
  KeyboardEventExtended,
  NineSliceSpriteComponent,
  Size,
  SpriteComponent,
  SpriteTextInputComponent,
} from "@openhotel/pixi-components";
import { useApi, useModal, useProxy } from "shared/hooks";
import { Event, Modal, SpriteSheetEnum } from "shared/enums";
import { RoomPreviewComponent, RoomsListComponentWrapper } from "./components";
import { NavigatorRoom } from "shared/types";
import { useTranslation } from "react-i18next";

type Props = {
  size: Size;
};

export const CategoryRoomsComponent: React.FC<Props> = ({ size }) => {
  const { fetch } = useApi();
  const { emit } = useProxy();
  const { isModalOpen } = useModal();
  const { t } = useTranslation();
  const [selectedRoomId, setSelectedRoomId] = useState<string>(null);
  const [rooms, setRooms] = useState<NavigatorRoom[]>([]);
  const [search, setSearch] = useState("");
  const [filteredRooms, setFilteredRooms] = useState<NavigatorRoom[]>([]);

  useEffect(() => {
    if (!search) {
      setFilteredRooms(rooms);
    }

    setFilteredRooms(
      rooms.filter((room) =>
        room.title.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [rooms, search]);

  const $reload = useCallback(() => {
    fetch("/room-list", {
      type: "private",
    }).then(({ rooms }: { rooms: any[] }) => {
      setRooms(
        rooms.map((room) => ({
          id: room.id,
          title: room.title,
          description: room.description,
          ownerUsername: room.ownerUsername,
          users: room.userCount,
          maxUsers: room.maxUsers,
          favorite: false,
        })),
      );
    });
  }, [setRooms, fetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen(Modal.NAVIGATOR)) return;

      $reload();
    }, 30_000);
    $reload();

    return () => {
      clearInterval(interval);
    };
  }, [$reload]);

  const onClick = useCallback(
    (roomId: string) => {
      setSelectedRoomId(roomId);
    },
    [setSelectedRoomId],
  );

  const onClickGo = useCallback(
    (roomId: string) => {
      emit(Event.PRE_JOIN_ROOM, {
        roomId,
      });
      $reload();
    },
    [emit, $reload],
  );

  const onClickFavorite = useCallback(() => {}, []);

  const previewSize = useMemo(
    () => ({
      width: 130,
      height: size.height,
    }),
    [size],
  );

  const $selectedRoom = useMemo(
    () =>
      selectedRoomId ? rooms.find((room) => room.id === selectedRoomId) : null,
    [rooms, selectedRoomId],
  );

  const onJoinRoom = useCallback(() => {
    emit(Event.PRE_JOIN_ROOM, {
      roomId: selectedRoomId,
    });
  }, [emit, selectedRoomId]);

  const searchFunction = useCallback(
    (event: KeyboardEventExtended) => {
      setSearch(event.target.value);

      setFilteredRooms(
        rooms.filter((room) => {
          return room.title
            .toLowerCase()
            .includes(event.target.value.toLowerCase());
        }),
      );
    },
    [rooms],
  );

  return (
    <>
      <ContainerComponent>
        <NineSliceSpriteComponent
          texture="bubble-message-ring"
          spriteSheet={SpriteSheetEnum.UI}
          leftWidth={7}
          rightWidth={7}
          topHeight={7}
          bottomHeight={7}
          width={size.width - 133}
          tint={0x3b3b3b}
          alpha={1}
        />
        <SpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="search-bubble-icon"
          position={{
            x: 1,
            y: 1,
          }}
        />

        <SpriteTextInputComponent
          width={size.width - 133}
          height={10}
          spriteSheet={SpriteSheetEnum.DEFAULT_FONT}
          padding={{
            left: 30,
            right: 10,
            top: 4,
            bottom: 0,
          }}
          placeholder={t("navigator.search")}
          placeholderProps={{
            color: 0x1,
            alpha: 0.5,
          }}
          maxLength={100}
          backgroundColor={0x88}
          backgroundAlpha={0}
          value={search}
          focusNow={0}
          onChange={searchFunction}
        />
      </ContainerComponent>

      <ContainerComponent
        position={{
          x: 0,
          y: 19,
        }}
      >
        <RoomsListComponentWrapper
          size={{
            ...size,
            width: size.width - 130,
            height: size.height - 20,
          }}
          rooms={filteredRooms}
          onClick={onClick}
          onClickGo={onClickGo}
          onClickFavorite={onClickFavorite}
        />
      </ContainerComponent>
      <ContainerComponent
        position={{
          x: size.width - 130,
        }}
      >
        {selectedRoomId && $selectedRoom ? (
          <RoomPreviewComponent
            size={previewSize}
            room={$selectedRoom}
            onJoin={onJoinRoom}
          />
        ) : (
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={previewSize.width}
            height={previewSize.height}
            tint={0xff00ff}
          />
        )}
      </ContainerComponent>
    </>
  );
};
