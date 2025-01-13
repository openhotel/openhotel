import { UserMutable } from "./user.types.ts";

export type Command = {
  command: string;
  usages?: string[];
  description?: string;
  func: (data: {
    args: (string | number)[];
    user: UserMutable;
  }) => Promise<void> | void;
};

export type ListActions = "on" | "off" | "list" | "add" | "remove";
