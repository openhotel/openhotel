type Props = {
  url: string;
  reconnect?: boolean;
  reconnectIntents?: number;
  reconnectInterval?: number;
  silent?: boolean;
  protocols?: string[];
};

type Mutable = {
  connect: () => Promise<void>;
  emit: (
    event: string,
    message?: unknown,
    response?: (message?: unknown) => void,
  ) => void;
  on: (
    event: "connected" | "disconnected" | "error",
    callback: (data?: unknown) => void,
  ) => () => void;
  close: () => void;
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

export const getWebSocketUrl = (url: string): string => {
  const { protocol, hostname, pathname, port } = new URL(url);

  const socketProtocol = protocol === "http:" ? "ws:" : "wss:";
  return `${socketProtocol}//${hostname}${port ? `:${port}` : ""}${pathname}`;
};

export const getClientSocket = ({
  url,
  reconnect = true,
  reconnectIntents = 10,
  reconnectInterval = 1_000,
  silent = false,
  protocols = [],
}: Props): Mutable => {
  const events: Record<string, ((data?: unknown) => unknown | null)[]> = {};

  let socket: WebSocket;
  let reconnects = 0;
  let isConnected = false;
  let isClosed = false;

  const emitEventCallback = (event: string, data?: unknown) => {
    if (!events[event]) return;

    for (const callback of events[event]) callback?.(data);
  };

  const connect = (): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      try {
        if (isConnected) return resolve();

        const $onOpen = () => {
          isConnected = true;
          !silent && console.log(`Connected to ${url}!`);
          emitEventCallback("connected");
          resolve();
          reconnects = 0;
        };
        const $onMessage = ({ data }: any) => {
          const { event, message } = JSON.parse(data);
          if (!events[event]) return;

          emitEventCallback(event, message);
        };
        const $onError = (message: unknown) =>
          emitEventCallback("error", message);
        const $onClose = (message: unknown) => {
          !silent && isConnected && console.log(`Disconnected from ${url}!`);

          // resovle if it's already closed
          if (isClosed) return resolve();

          isConnected = false;
          if (
            reconnect &&
            (reconnectIntents > reconnects || reconnectIntents === -1)
          ) {
            emitEventCallback("reconnecting");
            reconnects++;
            !silent &&
              console.log(
                `(${reconnects}/${reconnectIntents}) Reconnecting to ${url} in ${reconnectInterval}ms...`,
              );
            setTimeout(async () => {
              await connect();
              resolve();
            }, reconnectInterval);
            return;
          }
          emitEventCallback("disconnected", message);
          resolve();
        };

        if (socket) {
          socket.removeEventListener("open", $onOpen);
          socket.removeEventListener("message", $onMessage);
          socket.removeEventListener("error", $onError);
          socket.removeEventListener("close", $onClose);
        }

        !silent && reconnects === 0 && console.log(`Connecting to ${url}!`);
        socket = new WebSocket(url, protocols);

        socket.addEventListener("open", $onOpen);
        socket.addEventListener("message", $onMessage);
        socket.addEventListener("error", $onError);
        socket.addEventListener("close", $onClose);
      } catch (e) {
        reject(e);
      }
    });

  const emit = (
    event: string,
    message?: unknown,
    response?: (message?: unknown) => void,
  ): void => {
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
    callback: (data?: unknown) => void,
  ): (() => void) => {
    if (!events[event]) events[event] = [];

    const index = events[event].push(callback) - 1;
    return () =>
      (events[event] = events[event].map<(data?: unknown) => unknown>(
        (callback, $index) =>
          (index === $index ? null : callback) as (data?: unknown) => unknown,
      ));
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
