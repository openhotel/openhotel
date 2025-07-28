import { UserMutable } from "shared/types/user.types.ts";

export type GameManifest = {
  id: string;
  name: string;
  repository: string;
  client: {
    path: string;
  };
  properties: {
    kickFromCurrentRoom: boolean;
  };
};

export type GameType = {
  path: string;
  executable: string;
  manifest: GameManifest;
};

export type GameMutable = {
  getPath: () => string;
  getExecutable: () => string;
  getManifest: () => GameManifest;

  addUserRequest: (user: UserMutable, token: string) => void;
  addUser: (user: UserMutable, clientId: string) => void;
  setUserReady: (user: UserMutable, clientId: string) => void;
  removeUser: (user: UserMutable, clientId: string) => void;

  getUser: (data: { clientId: string }) => UserMutable | null;

  emit: (event: string, message: any) => void;
};
