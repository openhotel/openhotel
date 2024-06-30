export type ConfigTypes = {
  name?: string;
  description?: string;
  ports?: {
    client?: number;
    server?: number;
    range?: [number, number];
  };
  limits?: {
    players?: number;
    handshake?: number;
  };
};
