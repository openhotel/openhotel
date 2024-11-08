export type ConfigTypes = {
  version?: string;
  name?: string;
  description?: string;
  port?: number;

  limits?: {
    players?: number;
  };
  auth?: {
    enabled: boolean;
    redirectUrl?: string;
    api?: string;
    pingCheck?: boolean;
    userDisconnectedEvent?: boolean;
  };
  onet: {
    enabled: boolean;
  };
};
