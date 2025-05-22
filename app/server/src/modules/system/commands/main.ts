import { UserMutable } from "shared/types/user.types.ts";
import { log } from "shared/utils/log.utils.ts";

import { stopCommand } from "./stop.command.ts";
import { opCommand } from "./op.command.ts";
import { deopCommand } from "./deop.command.ts";
import { banCommand } from "./ban.command.ts";
import { unbanCommand } from "./unban.command.ts";
import { blacklistCommand } from "./blacklist.command.ts";
import { whitelistCommand } from "./whitelist.command.ts";
import { kickCommand } from "./kick.command.ts";
import { updateCommand } from "./update.command.ts";
import { tpCommand } from "./tp.command.ts";
import { setCommand } from "./set.command.ts";
import { helpCommand } from "./help.command.ts";
import { unsetCommand } from "./unset.command.ts";
import { teleportCommand } from "./teleport.command.ts";
import { clearCommand } from "./clear.command.ts";
import { rotateCommand } from "./rotate.command.ts";
import { moveCommand } from "./move.command.ts";
import { whisperCommand } from "./whisper.command.ts";
import { replyCommand } from "./reply.command.ts";
import { photoCommand } from "./photo.command.ts";
import { creditsCommand } from "./credits.command.ts";
import { tokenCommand } from "./token.command.ts";
import { colorCommand } from "./color.command.ts";

import { ProxyEvent } from "shared/enums/event.enum.ts";
import {
  parseCommandArgs,
  validateCommandUsages,
} from "shared/utils/commands.utils.ts";
import { CommandRoles } from "shared/types/commands.types.ts";

export const commandList = [
  stopCommand,

  opCommand,
  deopCommand,

  banCommand,
  unbanCommand,

  blacklistCommand,
  whitelistCommand,

  kickCommand,
  updateCommand,

  tpCommand,

  setCommand,
  unsetCommand,

  helpCommand,

  teleportCommand,

  clearCommand,

  rotateCommand,
  moveCommand,

  whisperCommand,
  replyCommand,

  photoCommand,

  creditsCommand,

  tokenCommand,

  colorCommand,
];

export const executeCommand = async ({
  message,
  user,
}: {
  message: string;
  user: UserMutable;
}) => {
  if (!message.startsWith("/")) return false;

  const args = parseCommandArgs(message) as string[];

  const foundCommand = commandList.find(({ command }) => {
    if (typeof command === "string") return args[0] === command;
    return command.find((c) => args[0] === c);
  });

  if (!foundCommand) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: "Command not found",
    });
    return true;
  }

  const isOp = await user.isOp();
  if (foundCommand.role === CommandRoles.OP && !isOp) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: "Insufficient permissions",
    });
    return true;
  }

  log(`Command /${foundCommand.command} executed by ${user.getUsername()}!`);
  args.shift();

  const usages = foundCommand.usages || [];

  if (usages.length > 0) {
    const validation = validateCommandUsages(foundCommand, args);
    if (!validation.isValid) {
      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: `${validation.errorMessage}`,
      });
      return true;
    }
  }

  try {
    foundCommand.func({ user, args: args } as any);
  } catch (e) {
    console.error(`Something went wrong with command ${message}`);
  }

  return true;
};
