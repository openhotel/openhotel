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

  //returns a token to check if the account is valid when connecting
  getToken: (accountId: string) => string;
};
