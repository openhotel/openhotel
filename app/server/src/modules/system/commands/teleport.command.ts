import { Command } from "shared/types/main.ts";
import { encodeBase64 } from "@oh/utils";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";

export const teleportCommand: Command = {
  command: "teleport",
  func: async ({ user, args }) => {
    const [type, ...moreArgs] = args as string[];

    switch (type) {
      case "local":
        const [x1, z1, x2, z2] = (moreArgs as string[]).map((num) =>
          parseInt(num),
        );
        System.game.teleports.createLocal(user.getRoom(), x1, z1, x2, z2);
        break;
      case "onet":
        const [hostname, roomName, x, z] = moreArgs as string[];
        const redirectUrl = new URL(hostname);
        redirectUrl.searchParams.append(
          "meta",
          encodeBase64([0, roomName, x, z]),
        );

        user.emit(ProxyEvent.REDIRECT, { redirectUrl: redirectUrl.href });
        break;
    }

    //TODO check with onet if is valid
  },
};
