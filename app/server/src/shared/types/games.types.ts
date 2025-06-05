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
