export const getWebSocketUrl = (url: string) => {
  const { protocol, hostname, pathname, port } = new URL(url);

  const socketProtocol = protocol === "http:" ? "ws:" : "wss:";
  return `${socketProtocol}//${hostname}${port ? `:${port}` : ""}${pathname}`;
};

type Props = {
  url: string;
  reconnect?: boolean;
  reconnectIntents?: number;
  reconnectInterval?: number;
  silent?: boolean;
  protocols?: string[];
};

enum ReadyState {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

const getRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export type ClientSocketMutable = {
  connect: () => Promise<unknown>;
  emit: <Event>(
    event: string | Event,
    message?: any,
    response?: (message?: any) => void,
  ) => void;
  on: (
    event: "connected" | "disconnected" | "error" | string,
    callback: (data?: any) => void,
  ) => () => void;
  close: () => void;
};

export const getClientSocket = ({
  url,
  reconnect = true,
  reconnectIntents = 10,
  reconnectInterval = 1_000,
  silent = false,
  protocols = [],
}: Props): ClientSocketMutable => {
  const events: Record<string, Function[]> = {};

  let socket;
  let reconnects = 0;
  let isConnected = false;
  let isClosed = false;

  const emitEventCallback = (event: string, data?: any) => {
    if (!events[event]) return;

    for (const callback of events[event].filter((func) => func !== null))
      callback?.(data);
  };

  const connect = async () =>
    new Promise((resolve, reject) => {
      try {
        if (isConnected) return resolve(null);

        !silent && reconnects === 0 && console.log(`Connecting to ${url}!`);
        socket = new WebSocket(url, protocols);

        // Connection opened
        socket.addEventListener("open", () => {
          isConnected = true;
          !silent && console.log(`Connected to ${url}!`);
          emitEventCallback("connected");
          resolve(null);
          reconnects = 0;
        });

        // Listen for messages
        socket.addEventListener("message", async ({ data }) => {
          const { event, message } = JSON.parse(data);
          if (!events[event]) return;

          emitEventCallback(event, message);
        });

        socket.addEventListener("error", (message) =>
          emitEventCallback("error", message),
        );

        socket.addEventListener("close", (message) => {
          !silent && isConnected && console.log(`Disconnected from ${url}!`);

          // resovle if it's already closed
          if (isClosed) return resolve(null);

          isConnected = false;
          if (reconnect && reconnectIntents > reconnects) {
            reconnects++;
            !silent &&
              console.log(
                `(${reconnects}/${reconnectIntents}) Reconnecting to ${url} in ${reconnectInterval}ms...`,
              );
            setTimeout(async () => {
              await connect();
              resolve(null);
            }, reconnectInterval);
            return;
          }
          emitEventCallback("disconnected", message);
          resolve(null);
        });
      } catch (e) {
        reject(e);
      }
    });

  const emit = (
    event: string,
    message?: any,
    response?: (message?: any) => void,
  ) => {
    if (socket.readyState !== ReadyState.OPEN)
      throw new Error(
        `Socket is not open (${ReadyState[socket.readyState]}}) {${event}:${message}}!`,
      );

    let responseEventId = null;
    if (response) {
      responseEventId = getRandomString(32);

      on(`${event}#${responseEventId}`, (data) => response(data));
    }
    socket.send(
      JSON.stringify({ event, message: message || {}, responseEventId }),
    );
  };

  const on = (
    event: "connected" | "disconnected" | "error" | string,
    callback: (data?: any) => void,
  ) => {
    if (!events[event]) events[event] = [];

    const index = events[event].push(callback) - 1;
    return () => {
      events[event] = events[event].map((callback, $index) =>
        index === $index ? null : callback,
      );
    };
  };

  const close = () => {
    isClosed = true;
    socket.close();
  };

  return {
    connect,
    emit,
    on,
    close,
  };
};
