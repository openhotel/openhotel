import { System } from "../main.ts";
import {
  Command,
  CommandRoles,
  PrivateRoomMutable,
} from "shared/types/main.ts";
import {
  // CAMERA_BW_PALETTE,
  // CAMERA_GREEN_PALETTE,
  CAMERA_SEPIA_PALETTE,
} from "shared/consts/camera.consts.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export const photoCommand: Command = {
  command: "photo",
  usages: ["<x> <y> <scale>"],
  // usages: [],
  role: CommandRoles.OP,
  description: "command.photo.description",
  func: async ({ user, args }) => {
    const room = (await System.game.rooms.get(
      user.getRoom(),
    )) as PrivateRoomMutable;

    const size = {
      width: 256,
      height: 256,
    };

    const position = {
      x: parseInt(args[0]) + size.width / 2,
      y: parseInt(args[1]) + size.height / 2,
    };
    const id = System.phantom.capture({
      room: await room.getObjectWithUsers(),
      position,
      size,
      palette: CAMERA_SEPIA_PALETTE,
    });
    user.emit(ProxyEvent.SYSTEM_MESSAGE, { message: `Photo id ${id}` });
  },
};
