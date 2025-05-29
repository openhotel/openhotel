import { PrivateRoomMutable, ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { isPointAdjacent } from "shared/utils/position.utils.ts";

export const pointerInteractiveEvent: ProxyEventType<any> = {
  event: ProxyEvent.POINTER_INTERACTIVE,
  func: async ({ data: { position }, user }) => {
    // if (!isPoint3dEqual(position, user.getPosition())) return;

    let room = await System.game.rooms.get<PrivateRoomMutable>(user.getRoom());

    if (room.type !== "private") return;

    if (!isPointAdjacent(user.getPosition(), position)) return;

    //TODO Add teleport logic here!
    // let teleportFurniture = null;
    //
    // const moveToPosition = () => {
    //   const targetBodyDirection = getDirection(user.getPosition(), position);
    //
    //   user.setPosition(position);
    //   user.setBodyDirection(targetBodyDirection);
    //   room.emit(ProxyEvent.MOVE_HUMAN, {
    //     accountId: user.getAccountId(),
    //     position,
    //     bodyDirection: targetBodyDirection,
    //   });
    //   user.setAction(null);
    // };

    // if (teleportFurniture && user.getAction() !== UserAction.TELEPORTING) {
    //   user.setAction(UserAction.TELEPORTING);
    //
    //   const teleportFrom = await System.game.teleports.get(
    //     teleportFurniture.id,
    //   );
    //   if (!teleportFrom?.to) return moveToPosition();
    //
    //   if (teleportFrom.to === "onet") {
    //     moveToPosition();
    //     try {
    //       const teleport = await System.game.teleports.remote.get(
    //         teleportFurniture.id,
    //       );
    //       const targetHotel = await System.auth.fetch({
    //         url: `/hotel?hotelId=${teleport.hotelId}&integrationId=${teleport.integrationId}`,
    //       });
    //
    //       const redirectUrl = new URL(targetHotel.redirectUrl);
    //       redirectUrl.searchParams.append(
    //         "meta",
    //         encodeBase64([Meta.TELEPORT, teleport.teleportId]),
    //       );
    //
    //       user.emit(ProxyEvent.REDIRECT, { redirectUrl: redirectUrl.href });
    //     } catch (e) {}
    //     return;
    //   }
    //
    //   const teleportTo = await System.game.teleports.get(teleportFrom.to);
    //   if (!teleportTo || !teleportTo.roomId) return moveToPosition();
    //
    //   const bodyDirection = getDirection(user.getPosition(), position);
    //   user.setBodyDirection(bodyDirection);
    //   room.emit(ProxyEvent.MOVE_HUMAN, {
    //     accountId: user.getAccountId(),
    //     position,
    //     bodyDirection,
    //   });
    //
    //   const isSameRoom = teleportTo.roomId === user.getRoom();
    //
    //   if (!isSameRoom)
    //     room = await System.game.rooms.get<PrivateRoomMutable>(
    //       teleportTo.roomId,
    //     );
    //
    //   teleportFurniture = room
    //     .getFurniture()
    //     .find((furniture) => furniture.id === teleportFrom.to);
    //
    //   const teleportPosition = teleportFurniture.position;
    //
    //   System.tasks.add({
    //     type: TickerQueue.DELAY,
    //     delay: MOVEMENT_BETWEEN_TILES_DURATION,
    //     onDone: async () => {
    //       user.setAction(null);
    //
    //       if (!isSameRoom) await user.moveToRoom(teleportTo.roomId);
    //
    //       user.setPosition(teleportPosition);
    //       room.emit(ProxyEvent.SET_POSITION_HUMAN, {
    //         accountId: user.getAccountId(),
    //         position: teleportPosition,
    //       });
    //       user.setBodyDirection(
    //         getDirectionFromCrossDirection(teleportFurniture.direction),
    //       );
    //
    //       const nextAddedPosition = getPointFromCrossDirection(
    //         teleportFurniture.direction,
    //       );
    //       const nextPosition = {
    //         x: teleportPosition.x + nextAddedPosition.x,
    //         y: teleportPosition.y,
    //         z: teleportPosition.z + nextAddedPosition.z,
    //       };
    //       if (!room.isPointFree(nextPosition)) return;
    //
    //       const targetBodyDirection = getDirection(
    //         user.getPosition(),
    //         nextPosition,
    //       );
    //
    //       user.setPosition(nextPosition);
    //       user.setBodyDirection(targetBodyDirection);
    //       room.emit(ProxyEvent.MOVE_HUMAN, {
    //         accountId: user.getAccountId(),
    //         position: nextPosition,
    //         bodyDirection: targetBodyDirection,
    //       });
    //     },
    //   });
    // }
  },
};
