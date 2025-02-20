import { System } from "../main.ts";
import {
  Command,
  CommandRoles,
  RoomFurniture,
  RoomMutable,
} from "shared/types/main.ts";
import { FurnitureType, ProxyEvent } from "shared/enums/main.ts";
import { CrossDirection } from "@oh/utils";
import { __ } from "shared/utils/languages.utils.ts";
import { ulid } from "@std/ulid";

const fillDemoRoom = async (room: RoomMutable) => {
  const list = await System.game.furniture.getList();
  const furnitures = list.filter((f) => f.type !== FurnitureType.FRAME);
  const frames = list.filter((f) => f.type === FurnitureType.FRAME);

  let row = 0;
  let col = 1;

  for (const data of furnitures) {
    const furniture: RoomFurniture = {
      furnitureId: data.id,
      type: data.type,
      id: ulid(),
      direction: CrossDirection.NORTH,
      position: { x: col, y: 0, z: row },
    };

    if (furniture.type === FurnitureType.TELEPORT) {
      await System.game.teleports.setRoom(furniture.id, room.getId());
    }

    await room.addFurniture(furniture);
    room.emit(ProxyEvent.ADD_FURNITURE, { furniture });

    row += 2;
    if (row > 9) {
      row = 1;
      col += 3;
    }
  }

  row = 1;
  col = 1;
  let side = false;
  for (const data of frames) {
    const odd = frames.indexOf(data) % 2;

    const frame: RoomFurniture = {
      furnitureId: data.id,
      type: data.type,
      id: ulid(),
      direction: side ? CrossDirection.EAST : CrossDirection.NORTH,
      position: { x: side ? row : col, y: 0, z: side ? col : row },
      framePosition: { x: 0, y: odd ? 35 : 15 },
    };

    await room.addFurniture(frame);
    room.emit(ProxyEvent.ADD_FURNITURE, { furniture: frame });

    if (odd) {
      row += 2;
      if (row > 9) {
        side = true;
        row = 2;
        col = 0;
      }
    }
  }
};
const fillRoom1 = async (room: RoomMutable) => {
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
      id: ulid(),
      direction: data.direction,
      position: data.position,
    };

    if (furniture.type === FurnitureType.FRAME) {
      furniture.framePosition = data.framePosition;
    }

    if (furniture.type === FurnitureType.TELEPORT) {
      await System.game.teleports.setRoom(furniture.id, room.getId());
    }

    await room.addFurniture(furniture);
    room.emit(ProxyEvent.ADD_FURNITURE, { furniture });
    addedFurniture.push(furniture);
  }

  const teleports = addedFurniture.filter(
    (f) => f.type === FurnitureType.TELEPORT,
  );

  if (teleports.length >= 2) {
    const [teleportA, teleportB] = teleports;
    await System.game.teleports.setLink(teleportA.id, teleportB.id);
  }
};

export const demoCommand: Command = {
  command: "demo",
  usages: [""],
  role: CommandRoles.OP,
  description: "command.demo.description",
  func: async ({ user }) => {
    const roomId = user.getRoom();
    const currentRoom = await System.game.rooms.get(roomId);

    const filler = {
      ["Demo Furnitures"]: fillDemoRoom,
      ["Room 1"]: fillRoom1,
    };

    if (!filler[currentRoom.getTitle()]) {
      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: __(user.getLanguage())(
          "Demo command is not configured in {{room}}",
          { room: currentRoom.getTitle() },
        ),
      });
      return;
    }

    await filler[currentRoom.getTitle()](currentRoom);
  },
};
