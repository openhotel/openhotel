import { Command } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";

export const teleportCommand: Command = {
  command: "teleport",
  func: async ({ user, args }) => {
    const [type, ...moreArgs] = args as string[];
    const room = await System.game.rooms.get(user.getRoom());

    switch (type) {
      case "link":
        const [id] = moreArgs as string[];
        const furniture = room.getFurnitures();
        const teleport = furniture.find((furni) => furni.uid === id);
        if (!teleport) return;

        await System.game.teleports.setLink(id);
        break;
      // case "local":
      //   const [x1, z1, x2, z2] = (moreArgs as string[]).map((num) =>
      //     parseInt(num),
      //   );
      //   System.game.teleports.createLocal(user.getRoom(), x1, z1, x2, z2);
      //   break;
      // case "onet":
      //   const [hostname, roomName, x, z] = moreArgs as string[];
      //   const redirectUrl = new URL(hostname);
      //   redirectUrl.searchParams.append(
      //     "meta",
      //     encodeBase64([0, roomName, x, z]),
      //   );
      //
      //   user.emit(ProxyEvent.REDIRECT, { redirectUrl: redirectUrl.href });
      //   break;
    }

    //TODO check with onet if is valid
  },
};
