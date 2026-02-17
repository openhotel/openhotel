import { PrivateRoomMutable, ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const actionFurnitureEvent: ProxyEventType<{
  id: string;
  actionId: string;
}> = {
  event: ProxyEvent.ACTION_FURNITURE,
  func: async ({ data: { id, actionId }, user }) => {
    const roomId = user.getRoom();
    if (!roomId) return;

    const room = await System.game.rooms.get<PrivateRoomMutable>(roomId);
    if (room.type !== "private") return;

    const furniture = room
      .getFurniture()
      .find((furniture) => furniture.id === id);
    if (!furniture) return;

    const furnitureData = await System.game.furniture.get(
      furniture.furnitureId,
    );
    if (!furnitureData?.actions?.length) return;

    const action = furnitureData.actions.find((a) => a.id === actionId);
    if (!action) return;

    const currentState = furniture.state ?? action.defaultState;
    const currentIndex = action.states.indexOf(currentState);
    const nextIndex = (currentIndex + 1) % action.states.length;

    furniture.state = action.states[nextIndex];
    await room.updateFurniture(furniture);
  },
};
