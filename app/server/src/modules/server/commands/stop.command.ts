import { Command } from "shared/types/main.ts";

export const stopCommand: Command = {
  command: "stop",
  func: () => {
    //@ts-ignore
    Deno.exit();
  },
};
