import { parseArgs } from "deno/cli/parse_args.ts";
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
];

export const executeCommand = ({
  message,
  user,
}: {
  message: string;
  user: UserMutable;
}) => {
  if (!message.startsWith("/")) return false;

  const { _ } = parseArgs(message.substring(1, message.length).split(" "));

  const foundCommand = commandList.find(({ command }) => _[0] === command);
  if (!foundCommand) return true;

  log(`Command /${foundCommand.command} executed by ${user.getUsername()}!`);
  _.shift();
  foundCommand.func({ user, args: _ } as any);

  return true;
};
