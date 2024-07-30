import {
  getClientSocket,
  getConfig,
  getRandomString,
  getVersion,
  getWebSocketUrl,
  isDevelopment,
} from "shared/utils";
import { Event } from "shared/enums";
import { getLoginUrl, getRefreshSessionUrl } from "shared/utils/auth.utils";

type ConnectProps = {
  username?: string;
  password?: string;
  captchaId?: string;
};

export const proxy = () => {
  const config = getConfig();

  let $sessionId;

  let $lastToken;

  let $lastUsername: string;
  let $lastPassword: string;

  let isConnected: boolean = false;
  let $socket;
  let eventFunctionMap: Record<Event | string, Function[]> = {};
  let eventFunctionRemoveMap: Record<Event | string, Function[]> = {};

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const setRefreshSession = (sessionId: string, refreshToken: string) => {
    $sessionId = sessionId;

    localStorage.setItem(
      "session-refresh",
      btoa(JSON.stringify({ sessionId, refreshToken })),
    );
  };

  const getRefreshSession = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("session-refresh")));
    } catch (e) {
      return null;
    }
  };

  const $connect = async () =>
    new Promise(async (resolve, reject) => {
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

        $socket.emit("session", {
          sessionId: $sessionId,
          token: $lastToken,
          username: $lastUsername,
        });
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

  const refreshSession = async () =>
    new Promise(async (resolve, reject) => {
      try {
        if (!isDevelopment()) {
          const { sessionId, refreshToken } = getRefreshSession();
          const { status: loginStatus, data } = await fetch(
            getRefreshSessionUrl(),
            {
              headers,
              method: "POST",
              body: JSON.stringify({
                sessionId,
                refreshToken,
              }),
            },
          ).then((data) => data.json());

          $lastToken = data?.token;
          $lastUsername = data?.username;
          setRefreshSession(sessionId, data?.refreshToken);

          if (loginStatus !== 200 || !$sessionId || !$lastToken) {
            reject("Incorrect username or password!");
            localStorage.removeItem("session-refresh");
            return;
          }
        } else {
          if (localStorage.getItem("auto-connect") === "false") reject();
          localStorage.setItem("auto-connect", "true");

          $lastUsername =
            localStorage.getItem("username") || `player_${getRandomString(8)}`;
        }
        resolve(await $connect());
      } catch (e) {
        reject(e);
        localStorage.removeItem("session-refresh");
      }
    });

  const connect = async ({
    username,
    password,
    captchaId,
  }: ConnectProps = {}) =>
    new Promise(async (resolve, reject) => {
      username && ($lastUsername = username);
      password && ($lastPassword = password);

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

        $lastToken = data?.token;
        setRefreshSession(data?.sessionId, data?.refreshToken);

        if (loginStatus !== 200 || !$sessionId || !$lastToken) {
          reject("Incorrect username or password!");
          return;
        }
      }

      try {
        resolve(await $connect());
      } catch (e) {
        reject(e);
      }
    });

  const emit = <Data>(event: Event, data: Data) => {
    $socket.emit("$$user-data", { event, message: data });
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
    refreshSession,
    getRefreshSession,

    emit,
    on,
  };
};
