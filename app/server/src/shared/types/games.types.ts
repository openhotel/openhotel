import { UserMutable } from "shared/types/user.types.ts";
import { Size2d } from "@oh/utils";

export type GameConfig = {
  version: string;
  name: string;
  //
  kickFromCurrentRoom: boolean;
  screen: "fullscreen" | "windowed";
  windowSize: Size2d;
};

export type GameType = {
  path: string;
  executable: string;

  gameId: string;
  name: string;
};

export type GameMutable = {
  getPath: () => string;
  getExecutable: () => string;
  getGameId: () => string;

  addUserRequest: (user: UserMutable, token: string) => boolean;
  addUser: (user: UserMutable, clientId: string) => void;
  setUserReady: (user: UserMutable, clientId: string) => void;
  removeUser: (user: UserMutable, clientId: string) => void;

  getUser: (data: { clientId: string }) => UserMutable | null;

  getConfig: () => Promise<GameConfig>;

  emit: (event: string, message: any) => void;
};
