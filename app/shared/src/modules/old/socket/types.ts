type EmitFunctionType = (
  event: string,
  data?: unknown,
  response?: (message?: unknown) => void,
) => void;

export type ServerClient = {
  id: string;
  _emit: EmitFunctionType;
  emit: EmitFunctionType;
  on: (
    event: string,
    callback: (data?: unknown) => Promise<void> | unknown,
  ) => void;
  remove: (event: string, id: number) => void;
  rooms: string[];

  getRooms: () => Room[];
  addRoom: (name: string) => void;
  removeRoom: (name: string) => void;

  close: (code?: number, reason?: string) => void;

  getSocket: () => WebSocket;
};

// @ignore-duplicate
export type Room = {
  name: string;
  emit: (event: string, data?: unknown) => void;
  clients: string[];

  getClients: () => ServerClient[];
  addClient: (clientId: string) => void;
  removeClient: (clientId: string) => void;
};

export type ServerSocket = {
  on: (
    event: "connected" | "disconnected" | "error" | "guest",
    callback: (client: ServerClient, data?: unknown) => any,
  ) => void;
  emit: (event: string, data?: unknown) => void;
  getClient: (clientId: string) => ServerClient;
  getRoom: (name: string) => Room;
  removeRoom: (name: string) => void;
  close: () => Promise<void>;
};
