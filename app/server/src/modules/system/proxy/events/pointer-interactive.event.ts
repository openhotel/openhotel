import { ProxyEventType } from "shared/types/main.ts";
import { FurnitureType, Meta, ProxyEvent } from "shared/enums/main.ts";
import {
  encodeBase64,
  getDirection,
  getDirectionFromCrossDirection,
  getPointFromCrossDirection,
  isPoint3dEqual,
} from "@oh/utils";
import { TickerQueue } from "@oh/queue";
import { System } from "modules/system/main.ts";
import { isPointAdjacent } from "shared/utils/position.utils.ts";
import { MOVEMENT_BETWEEN_TILES_DURATION } from "shared/consts/tiles.consts.ts";

export const pointerInteractiveEvent: ProxyEventType<any> = {
  event: ProxyEvent.POINTER_INTERACTIVE,
  func: async ({ data: { position }, user }) => {
    // if (!isPoint3dEqual(position, user.getPosition())) return;

    let room = await System.game.rooms.get(user.getRoom());

    if (!isPointAdjacent(user.getPosition(), position)) return;

    let teleportFurniture = room
      .getFurnitures()
      .find(
        (furniture) =>
          furniture.type === FurnitureType.TELEPORT &&
          isPoint3dEqual(position, furniture.position),
      );

    const moveToPosition = () => {
      const targetBodyDirection = getDirection(user.getPosition(), position);

      user.setPosition(position);
      user.setBodyDirection(targetBodyDirection);
      room.emit(ProxyEvent.MOVE_HUMAN, {
        accountId: user.getAccountId(),
        position,
        bodyDirection: targetBodyDirection,
      });
    };

    if (teleportFurniture) {
      const teleportFrom = await System.game.teleports.get(
        teleportFurniture.uid,
      );
      if (!teleportFrom?.to) return moveToPosition();

      if (teleportFrom.to === "onet") {
        try {
          const teleport = await System.game.teleports.remote.get(
            teleportFurniture.uid,
          );
          const targetHotel = await System.auth.fetch({
            url: `/hotel?hotelId=${teleport.hotelId}&integrationId=${teleport.integrationId}`,
          });

          const redirectUrl = new URL(targetHotel.redirectUrl);
          redirectUrl.searchParams.append(
            "meta",
            encodeBase64([Meta.TELEPORT, teleport.teleportId]),
          );

          user.emit(ProxyEvent.REDIRECT, { redirectUrl: redirectUrl.href });
          return;
        } catch (e) {
          return moveToPosition();
        }
      }

      const teleportTo = await System.game.teleports.get(teleportFrom.to);
      if (!teleportTo || !teleportTo.roomId) return moveToPosition();

      const bodyDirection = getDirection(user.getPosition(), position);
      user.setBodyDirection(bodyDirection);
      room.emit(ProxyEvent.MOVE_HUMAN, {
        accountId: user.getAccountId(),
        position,
        bodyDirection,
      });

      const isSameRoom = teleportTo.roomId === user.getRoom();

      if (!isSameRoom) room = await System.game.rooms.get(teleportTo.roomId);

      teleportFurniture = room
        .getFurnitures()
        .find((furniture) => furniture.uid === teleportFrom.to);

      const teleportPosition = teleportFurniture.position;

      System.tasks.add({
        type: TickerQueue.DELAY,
        delay: MOVEMENT_BETWEEN_TILES_DURATION,
        onDone: async () => {
          if (!isSameRoom) await user.moveToRoom(teleportTo.roomId);

          user.setPosition(teleportPosition);
          room.emit(ProxyEvent.SET_POSITION_HUMAN, {
            accountId: user.getAccountId(),
            position: teleportPosition,
          });
          user.setBodyDirection(
            getDirectionFromCrossDirection(teleportFurniture.direction),
          );

          const nextAddedPosition = getPointFromCrossDirection(
            teleportFurniture.direction,
          );
          const nextPosition = {
            x: teleportPosition.x + nextAddedPosition.x,
            y: teleportPosition.y,
            z: teleportPosition.z + nextAddedPosition.z,
          };
          if (!room.isPointFree(nextPosition)) return;

          const targetBodyDirection = getDirection(
            user.getPosition(),
            nextPosition,
          );

          user.setPosition(nextPosition);
          user.setBodyDirection(targetBodyDirection);
          room.emit(ProxyEvent.MOVE_HUMAN, {
            accountId: user.getAccountId(),
            position: nextPosition,
            bodyDirection: targetBodyDirection,
          });
        },
      });
    }
  },
};
