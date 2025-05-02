import { Command } from "../types/commands.types.ts";
import { getTextFromArgs } from "shared/utils/args.utils.ts";

export const parseCommandArgs = (message: string) => {
  const args = message
    .substring(1)
    .split(" ")
    .filter((arg) => arg !== "");

  return args.map((arg) => {
    if (/^-?\d+\.?\d*$/.test(arg)) return Number(arg);

    if (arg.toLowerCase() === "true") return true;
    if (arg.toLowerCase() === "false") return false;

    if (arg === "null") return null;
    if (arg === "undefined") return undefined;

    return arg;
  });
};

export const validateCommandUsages = (
  foundCommand: Command,
  args: string[],
): { isValid: boolean; errorMessage?: string } => {
  const argsRegex = /<[^>]+>|\[[^\]]+\]|\S+/g; // Matches "<...>", "[...]", "<...|...|...>", "[...|...|...]" and literals
  for (const usage of foundCommand.usages) {
    const usageTokens = usage.match(argsRegex);
    if (!usageTokens) {
      if (args.length === 0) return { isValid: true };
      continue;
    }

    let valid = true;
    let argIndex = 0;

    for (let i = 0; i < usageTokens.length; i++) {
      const token = usageTokens[i];
      const isOptional = token.startsWith("[") && token.endsWith("]");
      const cleanToken = token.replace(/[<>\[\]]/g, "");
      const choices = cleanToken.split("|");
      const arg = args[argIndex];

      if (arg === undefined) {
        if (!isOptional) {
          valid = false;
          break;
        }
        continue;
      }

      // Literal keyword check
      if (!token.startsWith("<") && !token.startsWith("[")) {
        if (token !== arg) {
          valid = false;
          break;
        }
        argIndex++;
        continue;
      }

      // Choice validation
      if (choices.length > 1) {
        if (!choices.includes(arg)) {
          valid = false;
          break;
        }
      }
      argIndex++;
    }

    if (valid && argIndex === args.length) {
      return { isValid: true };
    }
  }

  return {
    isValid: false,
    errorMessage: getTextFromArgs(
      "Invalid arguments. None of the following usages matched: {{usages}}",
      {
        usages: foundCommand.usages
          .map((usage) => `/${foundCommand.command} ${usage}`)
          .join(" or "),
      },
    ),
  };
};
