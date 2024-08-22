export type ConfigTypes = {
  version?: string;
  name?: string;
  description?: string;
  port?: number;
  limits?: {
    players?: number;
  };
  auth?: {
    redirectUrl?: string;
    url?: string;
    api?: string;
  };
};
