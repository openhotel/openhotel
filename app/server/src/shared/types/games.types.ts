import { UserMutable } from "shared/types/user.types.ts";

export type GameManifest = {};

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

  addUserRequest: (user: UserMutable, token: string) => void;
  addUser: (user: UserMutable, clientId: string) => void;
  setUserReady: (user: UserMutable, clientId: string) => void;
  removeUser: (user: UserMutable, clientId: string) => void;

  getUser: (data: { clientId: string }) => UserMutable | null;

  emit: (event: string, message: any) => void;
};
