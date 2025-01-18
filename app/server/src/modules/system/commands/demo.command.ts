import { System } from "../main.ts";
import { Command, RoomFurniture } from "shared/types/main.ts";
import { FurnitureType, ProxyEvent } from "shared/enums/main.ts";
import { CrossDirection } from "@oh/utils";

export const demoCommand: Command = {
  command: "demo",
  usages: ["[true|false]"],
  description: "command.demo.description",
  func: async ({ user, args }) => {
    const room1 = await System.game.rooms.getByName("Room 1");

    if (!room1) return;

    // Mock furniture data
    const mockFurnitureData = [
      {
        furnitureId: "alpha@small-lamp",
        type: FurnitureType.FURNITURE,
        position: { x: 1, y: 0, z: 7 },
        direction: CrossDirection.NORTH,
      },
      {
        furnitureId: "alpha@mid-lamp",
        type: FurnitureType.FURNITURE,
        position: { x: 2, y: 0, z: 7 },
        direction: CrossDirection.NORTH,
      },
      {
        furnitureId: "alpha@p-24",
        type: FurnitureType.FRAME,
        position: { x: 1, y: 0, z: 7 },
        direction: CrossDirection.NORTH,
        framePosition: { x: 0, y: 30 },
      },
      {
        furnitureId: "toys@octopus-0",
        type: FurnitureType.FURNITURE,
        position: { x: 3, y: 0, z: 5 },
        direction: CrossDirection.NORTH,
      },
      {
        furnitureId: "xmas@tree-0",
        type: FurnitureType.FURNITURE,
        position: { x: 6, y: -1, z: 9 },
        direction: CrossDirection.NORTH,
      },
      {
        furnitureId: "xmas@tree-1",
        type: FurnitureType.FURNITURE,
        position: { x: 7, y: -1, z: 9 },
        direction: CrossDirection.NORTH,
      },
      {
        furnitureId: "flags@pride-trans",
        type: FurnitureType.FRAME,
        position: { x: 4, y: 0, z: 3 },
        direction: CrossDirection.EAST,
        framePosition: { x: 0, y: 35 },
      },
      {
        furnitureId: "flags@europe",
        type: FurnitureType.FRAME,
        position: { x: 4, y: 0, z: 3 },
        direction: CrossDirection.EAST,
        framePosition: { x: 0, y: 15 },
      },
      {
        furnitureId: "teleports@telephone",
        type: FurnitureType.TELEPORT,
        position: { x: 1, y: 0, z: 3 },
        direction: CrossDirection.EAST,
      },
      {
        furnitureId: "teleports@telephone",
        type: FurnitureType.TELEPORT,
        position: { x: 6, y: -1, z: 0 },
        direction: CrossDirection.NORTH,
      },
    ];

    const addedFurniture: RoomFurniture[] = [];

    for (const data of mockFurnitureData) {
      const $furniture = await System.game.furniture.get(data.furnitureId);

      const furniture: RoomFurniture = {
        furnitureId: data.furnitureId,
        type: $furniture.type,
        id: crypto.randomUUID(),
        direction: data.direction,
        position: data.position,
      };

      if (furniture.type === FurnitureType.FRAME) {
        furniture.framePosition = data.framePosition;
      }

      if (furniture.type === FurnitureType.TELEPORT) {
        await System.game.teleports.setRoom(furniture.id, room1.getId());
      }

      await room1.addFurniture(furniture);
      room1.emit(ProxyEvent.ADD_FURNITURE, { furniture });
      addedFurniture.push(furniture);
    }

    const teleports = addedFurniture.filter(
      (f) => f.type === FurnitureType.TELEPORT,
    );

    if (teleports.length >= 2) {
      const [teleportA, teleportB] = teleports;
      await System.game.teleports.setLink(teleportA.id, teleportB.id);
    }
  },
};
