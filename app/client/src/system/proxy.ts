import {
  getClientSocket,
  getConfig,
  getVersion,
  getWebSocketUrl,
  isDevelopment,
} from "shared/utils";
import { Event } from "shared/enums";
import { getLoginUrl } from "shared/utils/auth.utils";

type ConnectProps = {
  username?: string;
  password?: string;
  captchaId?: string;
};

export const proxy = () => {
  const config = getConfig();

  let $lastUsername: string;
  let $lastPassword: string;

  let isConnected: boolean = false;
  let $socket;
  let eventFunctionMap: Record<Event | string, Function[]> = {};
  let eventFunctionRemoveMap: Record<Event | string, Function[]> = {};

  const connect = async ({
    username,
    password,
    captchaId,
  }: ConnectProps = {}) =>
    new Promise(async (resolve, reject) => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      username && ($lastUsername = username);
      password && ($lastPassword = password);

      let sessionId;
      let token;

      if (!isDevelopment()) {
        const { status: loginStatus, data } = await fetch(getLoginUrl(), {
          headers,
          method: "POST",
          body: JSON.stringify({
            username: $lastUsername,
            password: $lastPassword,
            captchaId,
          }),
        }).then((data) => data.json());

        sessionId = data?.sessionId;
        token = data?.token;

        if (loginStatus !== 200 || !sessionId || !token) {
          reject("Incorrect username or password!");
          return;
        }
      }
      const firewall = await fetch(
        `${config.firewall.url}/request?version=${getVersion()}`,
      ).then((data) => data.json());

      if (!firewall.token || !firewall.session) {
        reject("Cannot connect right now to the server :(!");
        return;
      }

      $socket = getClientSocket({
        url: getWebSocketUrl(config.firewall.url),
        protocols: [firewall.token, firewall.session],
        reconnect: false,
        silent: true,
      });
      $socket.on("connected", () => {
        console.log("handshake connected!");

        $socket.emit("session", { sessionId, token, username: $lastUsername });
      });
      $socket.on("join", async (data) => {
        $socket.close();
        $socket = getClientSocket({
          url: getWebSocketUrl(config.proxy.url),
          protocols: [data.token, data.session],
          reconnect: false,
          silent: true,
        });
        $socket.on("connected", () => {
          console.log("proxy connected!");
          isConnected = true;

          for (const event of Object.keys(eventFunctionMap)) {
            eventFunctionRemoveMap[event] = [];
            for (const eventCallback of eventFunctionMap[event])
              eventFunctionRemoveMap[event].push(
                $socket.on(event, eventCallback),
              );
          }

          resolve(1);
        });
        $socket.on("disconnected", () => {
          console.error("proxy disconnected!");
          isConnected = false;
          resolve(1);
        });
        await $socket.connect();
      });
      await $socket.connect();
    });

  const emit = <Data>(event: Event, data: Data) => {
    $socket.emit("$$data", { event, message: data });
  };

  const on = <Data>(
    event: Event,
    callback: (data: Data) => void | Promise<void>,
  ) => {
    if (!eventFunctionMap[event]) {
      eventFunctionMap[event] = [];
      eventFunctionRemoveMap[event] = [];
    }

    const index = eventFunctionMap[event].push(callback) - 1;
    if (isConnected)
      eventFunctionRemoveMap[event].push($socket.on(event, callback));

    return () => {
      eventFunctionRemoveMap[event][index]();
      eventFunctionMap[event] = eventFunctionMap[event].map(
        (callback, $index) => ($index === index ? null : callback),
      );
      eventFunctionRemoveMap[event] = eventFunctionRemoveMap[event].map(
        (callback, $index) => ($index === index ? null : callback),
      );
    };
  };

  return {
    connect,
    emit,
    on,
    // getSocket,
  };
};
