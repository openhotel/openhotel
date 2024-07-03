export type ConfigTypes = {
  name?: string;
  description?: string;
  ports?: {
    client?: number;
    firewall?: number;
    proxy?: number;
  };
  limits?: {
    players?: number;
    handshakes?: number;
  };
};
