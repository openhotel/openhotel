import { UserMutable } from "./user.types.ts";

export enum CommandRoles {
  OP,
  USER,
}

export type Command = {
  command: string | string[];
  usages?: string[];
  description?: string;
  role: CommandRoles;
  func: (data: {
    args: (string | number)[];
    user: UserMutable;
  }) => Promise<void> | void;
};

export type ListActions = "on" | "off" | "list" | "add" | "remove";
