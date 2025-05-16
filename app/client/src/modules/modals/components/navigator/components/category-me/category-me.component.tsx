import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
  KeyboardEventExtended,
  Size,
  SpriteComponent,
} from "@openhotel/pixi-components";
import { useAccount, useApi, useModal, useProxy } from "shared/hooks";
import { Event, Modal, SpriteSheetEnum } from "shared/enums";
import { RoomPreviewComponent, RoomsListComponentWrapper } from "./components";
import { NavigatorRoom } from "shared/types";
import { useTranslation } from "react-i18next";
import {
  ButtonComponent,
  InputComponent,
  SoftBadgeComponent,
} from "shared/components";

type Props = {
  size: Size;
};

export const CategoryMeComponent: React.FC<Props> = ({ size }) => {
  const { fetch } = useApi();
  const { getAccount } = useAccount();
  const { emit } = useProxy();
  const { isModalOpen, openModal } = useModal();
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
    fetch("/room/list", {
      type: "private",
      ownerId: getAccount().accountId,
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
          layoutIndex: room.layoutIndex,
        })),
      );
    });
  }, [setRooms, fetch, getAccount]);

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

  const onOpenCreateRoom = useCallback(() => {
    openModal(Modal.ROOM_CREATOR);
  }, [openModal]);

  return (
    <>
      <InputComponent
        size={{
          width: size.width - 133,
          height: 14,
        }}
        padding={{
          left: 22,
        }}
        placeholder={t("navigator.search")}
        value={search}
        onChange={searchFunction}
      >
        <SpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="search-bubble-icon"
          position={{
            x: 1,
            y: 1,
          }}
        />
      </InputComponent>

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
            height: size.height - 20 - 23,
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
      <ContainerComponent
        position={{
          y: size.height - 20,
        }}
      >
        <SoftBadgeComponent
          size={{
            width: size.width - 130 - 3,
            height: 20,
          }}
        />
        <ButtonComponent
          text={t("navigator.create_room")}
          autoWidth
          size={{ height: 14 }}
          position={{
            x: 3,
            y: 3,
          }}
          onPointerDown={onOpenCreateRoom}
        />
      </ContainerComponent>
    </>
  );
};
