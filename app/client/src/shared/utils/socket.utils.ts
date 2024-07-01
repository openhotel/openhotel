import { SocketReadyState } from "shared/enums";
import { getRandomString } from "./random.utils";

type Props = {
  url: string;
  reconnect?: boolean;
  reconnectIntents?: number;
  reconnectInterval?: number;
  silent?: boolean;
  protocols?: string[];
};

export const getClientSocket = ({
  url,
  reconnect = true,
  reconnectIntents = 10,
  reconnectInterval = 1_000,
  silent = false,
  protocols = [],
}: Props) => {
  const events: Record<string, any> = {};

  let socket;
  let reconnects = 0;
  let isConnected = false;
  let isClosed = false;

  const connect = async (secure: boolean = false) =>
    new Promise((resolve, reject) => {
      if (isConnected) return resolve(null);

      !silent && reconnects === 0 && console.log(`Connecting to ${url}!`);
      socket = new WebSocket(`${secure ? "wss" : "ws"}://${url}`, protocols);

      // Connection opened
      socket.addEventListener("open", () => {
        isConnected = true;
        !silent && console.log(`Connected to ${url}!`);
        events.connected && events.connected();
        resolve(null);
        reconnects = 0;
      });

      // Listen for messages
      socket.addEventListener("message", async ({ data }) => {
        const { event, message, responseEventId } = JSON.parse(data);
        if (!events[event]) return;

        const responseMessage = await events[event](message);

        if (responseMessage)
          socket.send(
            JSON.stringify({
              event: `${event}#${responseEventId}`,
              message: responseMessage,
            }),
          );
      });

      socket.addEventListener("error", () => events.error && events.error());

      socket.addEventListener("close", () => {
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
        events.disconnected && events.disconnected();
        resolve(null);
      });
    });

  const emit = (
    event: string,
    message?: any,
    response?: (message?: any) => void,
  ) => {
    if (socket.readyState !== SocketReadyState.OPEN)
      throw new Error(
        `Socket is not open (${SocketReadyState[socket.readyState]}}) {${event}:${message}}!`,
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
  ) => (events[event] = callback);

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
