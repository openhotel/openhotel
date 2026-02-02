import { UserMutable } from "shared/types/user.types.ts";
import { Size2d } from "@oh/utils";

export type GameSettings = {
  version: string;
  name: string;
  repo: string;
  //
  kickFromCurrentRoom: boolean;
  screen: "fullscreen" | "windowed";
  windowSize: Size2d;
};

export type GameType = {
  path: string;
  executable: string;
  isLocal: boolean;

  gameId: string;
  repo: string;
};

export type GameMutable = {
  getPath: () => string;
  getExecutable: () => string;
  getGameId: () => string;

  addUserRequest: (user: UserMutable, token: string) => boolean;
  addUser: (user: UserMutable) => void;
  setUserReady: (user: UserMutable) => void;
  removeUser: (user: UserMutable) => void;

  getUser: (data: { clientId: string }) => UserMutable | null;

  getSettings: () => Promise<GameSettings>;

  emit: (event: string, message: any) => void;
};
