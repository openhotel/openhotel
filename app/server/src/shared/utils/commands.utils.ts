import { Command } from "../types/commands.types.ts";
import { UserMutable } from "../types/user.types.ts";
import { __ } from "./languages.utils.ts";

export const validateCommandUsages = (
  foundCommand: Command,
  args: string[],
  user: UserMutable,
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
    errorMessage: __(user.getLanguage())(
      "Invalid arguments. None of the following usages matched: {{usages}}",
      {
        usages: foundCommand.usages
          .map((usage) => `/${foundCommand.command} ${usage}`)
          .join(" or "),
      },
    ),
  };
};
