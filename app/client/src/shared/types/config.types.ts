export type ConfigTypes = {
  version?: string;
  name?: string;
  description?: string;
  limits?: {
    players?: number;
  };

  client?: {
    port?: number;
  };
  proxy?: {
    port?: number;
    url?: string;
  };
  auth?: {
    redirectUrl?: string;
    url?: string;
    api?: string;
  };
};
