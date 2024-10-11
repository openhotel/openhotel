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
    api?: string;
    pingCheck?: boolean;
    userDisconnectedEvent?: boolean;
  };
  onet: {
    enabled: boolean;
  };
};
