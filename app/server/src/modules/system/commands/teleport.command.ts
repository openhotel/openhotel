import { Command } from "shared/types/main.ts";
import { encodeBase64 } from "@oh/utils";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export const teleportCommand: Command = {
  command: "teleport",
  func: async ({ user, args }) => {
    if (args.length !== 4) return;

    const [hostname, roomName, x, z] = args as string[];

    //TODO check with onet if is valid

    const redirectUrl = new URL(hostname);
    redirectUrl.searchParams.append("meta", encodeBase64([0, roomName, x, z]));

    user.emit(ProxyEvent.REDIRECT, { redirectUrl: redirectUrl.href });
  },
};
