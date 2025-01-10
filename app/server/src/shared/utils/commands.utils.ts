import {Command} from "../types/commands.types.ts";
import {UserMutable} from "../types/user.types.ts";
import {__} from "./languages.utils.ts";

export const validateCommandUsages = (
    foundCommand: Command,
    args: string[],
    user: UserMutable
):{ isValid: boolean; errorMessage?: string } => {
    const argsRegex = /<[^>]+>|\[[^\]]+\]|\S+/g // Matches "<...>", "[...]", "<...|...|...>", "[...|...|...]" and literals
    for (const usage of foundCommand.usages) {
        const usageTokens = usage.match(argsRegex);

        if (!usageTokens) {
            if (args.length === 0) return { isValid: true };
            continue; // Try the next usage pattern
        }

        let valid = true;
        for (let i = 0; i < usageTokens.length; i++) {
            const token = usageTokens[i];
            const arg = args[i];

            // Check if token is a literal keyword (e.g., "link" or "remote")
            if (!token.startsWith("<") && !token.startsWith("[")) {
                if (token !== arg) {
                    valid = false;
                    break;
                }
                continue;
            }

            const isOptional = token.startsWith("[") && token.endsWith("]");
            const cleanToken = token.replace(/[<>\[\]]/g, "");

            if (arg === undefined) {
                if (!isOptional) {
                    valid = false;
                    break;
                }
                continue;
            }

            // Validate against choices (e.g., "<on|off|list>")
            const choices = cleanToken.split("|");
            if (choices.length > 1 && !choices.includes(arg)) {
                valid = false;
                break;
            }
        }

        if (valid && args.length === usageTokens.length) {
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
            }
        ),
    };
};
