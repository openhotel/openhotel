import { System } from "../main.ts";
import {
  Command,
  CommandRoles,
  PrivateRoomMutable,
} from "shared/types/main.ts";
import { CAMERA_SEPIA_PALETTE } from "shared/consts/camera.consts.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export const photoCommand: Command = {
  command: "photo",
  usages: ["<x> <y>"],
  // usages: [],
  role: CommandRoles.OP,
  description: "command.photo.description",
  func: async ({ user, args }) => {
    const room = (await System.game.rooms.get(
      user.getRoom(),
    )) as PrivateRoomMutable;

    const size = {
      width: 128,
      height: 96,
    };

    const position = {
      x: parseInt(<string>args[0]) + size.width / 2,
      y: parseInt(<string>args[1]) + size.height / 2,
    };
    const id = System.phantom.capture({
      room: await room.getObjectWithUsers(),
      position,
      size,
      palette: CAMERA_SEPIA_PALETTE,
    });

    if (!id) {
      return user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: "Phantom is disabled! Check server config.",
      });
    }

    user.emit(ProxyEvent.SYSTEM_MESSAGE, { message: `Photo id ${id}` });
  },
};
