import { UserMutable } from "shared/types/user.types.ts";

export type GameManifest = {
  id: string;
  name: string;
  repository: string;
  client: {
    path: string;
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
};
