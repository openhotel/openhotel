import type { Room, ServerClient, ServerSocket } from "./types.ts";
import { getRandomString } from "@shared/utils/random.utils.ts";

export const getServerSocket = (
  port: number,
  next: (
    request: Request,
    connInfo: Deno.ServeHandlerInfo,
  ) => Response | Promise<Response> = (
    request: Request,
    connInfo: Deno.ServeHandlerInfo,
  ) => new Response(null, { status: 501 }),
): ServerSocket => {
  const clientList: Record<string, ServerClient> = {};
  const roomList: Record<string, Room> = {};
  const events: Record<string, any> = {};

  const server = Deno.serve({ port }, async (request: Request, connInfo) => {
    if (request.headers.get("upgrade") !== "websocket")
      return next(request, connInfo);

    const protocol = request.headers.get("Sec-WebSocket-Protocol");
    const protocols = (protocol || "").split(", ");

    const clientId = getRandomString(16);

    const guestIsNotWelcome =
      events.guest &&
      !(await events.guest({
        clientId,
        protocols,
        connInfo,
        headers: request.headers,
      }));
    if (guestIsNotWelcome) return new Response(null, { status: 403 });

    const { socket, response } = Deno.upgradeWebSocket(request, {
      protocol: protocols[0],
    });

    const clientEvents: Record<string, ((data?: unknown) => unknown)[]> = {};

    const emit = (event: string, message?: unknown) => {
      if (socket.readyState !== WebSocket.OPEN) return;

      socket.send(JSON.stringify({ event, message: message || {} }));
    };

    const client: ServerClient = {
      id: clientId,
      getSocket: () => socket,
      _emit: emit,
      emit,
      on: (event: string, callback: (data?: any) => Promise<any> | any) => {
        if (!clientEvents[event]) {
          clientEvents[event] = [];
        }
        return clientEvents[event].push(callback) - 1;
      },
      remove: (event: string, id: number) =>
        (clientEvents[event] = clientEvents[event].filter((client, index) =>
          index === id ? undefined : client,
        )),
      rooms: [],
      getRooms: () => clientList[clientId].rooms.map((name) => roomList[name]),
      addRoom: (name: string) => {
        if (clientList[clientId].rooms.includes(name)) {
          return console.warn(`Client ${clientId} is already in room ${name}!`);
        }

        clientList[clientId].rooms.push(name);
        if (!roomList[name]) throw `Room ${name} not found`;

        roomList[name].clients.push(clientId);
      },
      removeRoom: (name: string) => {
        if (!clientList[clientId].rooms.includes(name)) {
          return console.warn(`Client ${clientId} is not in room ${name}!`);
        }

        clientList[clientId].rooms.push(name);

        if (!roomList[name]) throw `Room ${name} not found`;

        roomList[name].clients = roomList[name].clients.filter(
          (_clientId) => _clientId !== clientId,
        );
      },
      close: (code, reason) => socket.close(code, reason),
    };
    clientList[client.id] = client;

    socket.onopen = () => {
      events.connected && events.connected(client);
    };
    socket.onmessage = async ({ data }) => {
      const { event, message } = JSON.parse(data);
      const clientEventList = (clientEvents[event] || []).filter(Boolean);

      if (clientEventList.length)
        for (const callback of clientEventList) callback(message);
    };
    socket.onclose = () => {
      events.disconnected && events.disconnected(client);
      for (const room of Object.values(roomList)) {
        room.clients = room.clients.filter(
          (clientId) => client.id !== clientId,
        );
      }

      delete clientList[client.id];
    };
    socket.onerror = (error) => {
      events.error && events.error(client, error);
    };

    return response;
  });

  const emit = (event: string, data?: unknown): void => {
    for (const client of Object.values(clientList)) client._emit(event, data);
  };

  const on = (
    event: "connected" | "disconnected" | "error" | "guest",
    callback: (client: ServerClient, data?: unknown) => void,
  ): void => {
    events[event] = callback;
  };

  const getClient = (clientId: string): ServerClient => clientList[clientId];
  const getRoom = (name: string): Room => {
    if (roomList[name]) return roomList[name];

    const room: Room = {
      name,
      emit: (event: string, message: unknown) => {
        for (const client of roomList[name].getClients()) {
          client._emit(event, message);
        }
      },

      clients: [],
      getClients: () =>
        roomList[name].clients.map((clientId) => clientList[clientId]),
      addClient: (clientId: string) => {
        //Already inside the room
        if (roomList[name].clients.includes(clientId)) return;

        if (!clientList[clientId]) throw `Client ${clientId} not found`;

        roomList[name].clients.push(clientId);
      },
      removeClient: (clientId: string) => {
        if (!clientList[clientId]) throw `Client ${clientId} not found`;

        roomList[name].clients = roomList[name].clients.filter(
          ($clientId) => clientId !== $clientId,
        );
      },
    };
    roomList[name] = room;
    return room;
  };
  const removeRoom = (name: string): void => {
    for (const client of roomList[name].getClients()) {
      client.rooms = client.rooms.filter((_name) => name !== _name);
    }

    delete roomList[name];
  };

  const close = () => server.shutdown();

  return {
    on,
    /**
     * Broadcast
     */
    emit,
    getClient,
    getRoom,
    removeRoom,
    close,
  };
};
