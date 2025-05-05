import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
  Size,
} from "@openhotel/pixi-components";
import { useApi, useModal, useProxy } from "shared/hooks";
import { Event, Modal } from "shared/enums";
import { RoomPreviewComponent, RoomsListComponentWrapper } from "./components";
import { NavigatorRoom } from "shared/types";

type Props = {
  size: Size;
};

export const CategoryRoomsComponent: React.FC<Props> = ({ size }) => {
  const { fetch } = useApi();
  const { emit } = useProxy();
  // const { isModalOpen } = useModal();

  const [selectedRoomId, setSelectedRoomId] = useState<string>(null);
  const [rooms, setRooms] = useState<NavigatorRoom[]>([]);

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
    // const interval = setInterval(() => {
    //   if (!isModalOpen(Modal.NAVIGATOR)) return;
    //
    //   $reload();
    // }, 30_000);
    $reload();

    // return () => {
    //   clearInterval(interval);
    // };
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

  return (
    <>
      <RoomsListComponentWrapper
        size={{
          ...size,
          width: size.width - 130,
        }}
        rooms={rooms}
        onClick={onClick}
        onClickGo={onClickGo}
        onClickFavorite={onClickFavorite}
      />
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
