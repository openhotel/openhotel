export type ConfigTypes = {
  version: 1;
  name?: string;
  description?: string;
  limits?: {
    players?: number;
    handshakes?: number;
  };

  client?: {
    port?: number;
  };
  firewall?: {
    port?: number;
    url?: string;
  };
  proxy?: {
    port?: number;
    url?: string;
  };
  auth?: {
    url?: string;
  };
};
