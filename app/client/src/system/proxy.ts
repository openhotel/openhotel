import {
  getBrowserLanguage,
  getClientSocket,
  getRandomString,
  getWebSocketUrl,
} from "shared/utils";
import { Event } from "shared/enums";
import { System } from "system/system";

export const proxy = () => {
  let isConnected: boolean = false;

  let $socket;
  let eventFunctionMap: Record<Event | string, Function[]> = {};
  let eventFunctionRemoveMap: Record<Event | string, Function[]> = {};

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const params = new URLSearchParams(location.search);
  let state = params.get("state");
  let token = params.get("token");
  let meta = params.get("meta");

  const getRefreshSession = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("session-refresh")));
    } catch (e) {
      return null;
    }
  };

  const canConnect = () => state && token;

  const clearConnection = () => {
    state = null;
    token = null;
  };

  const preConnect = async (): Promise<boolean> => {
    System.loader.addText("Requesting connection...");

    if (canConnect() || !System.config.get().auth.enabled) return true;

    const { status, data } = await fetch(
      `/request?version=${System.version.getVersion()}`,
    ).then((data) => data.json());
    if (status === 200) {
      const redirectUrl = new URL(data.redirectUrl);
      if (meta) redirectUrl.searchParams.append("meta", meta);

      window.location.replace(redirectUrl);
      System.loader.addText("Redirecting...");
      return false;
    }
    System.loader.addText("Something went wrong  :(");
    return false;
  };

  const connect = async () =>
    new Promise<void>(async (resolve, reject) => {
      try {
        const config = System.config.get();
        if (isConnected) return;
        System.loader.addText("Connecting...");
        window.history.pushState(null, null, "/");

        $socket = getClientSocket({
          url: getWebSocketUrl(`${window.location.origin}/proxy`),
          protocols: config.auth.enabled
            ? [state, token]
            : [
                localStorage.getItem("accountId") ||
                  "edd8081d-d160-4bf4-b89b-133d046c87ff",
                localStorage.getItem("username") ||
                  `player_${getRandomString(4)}`,
              ],
          reconnect: false,
          silent: true,
        });
        $socket.on("connected", () => {
          System.loader.addText("Connected!");
          isConnected = true;

          $socket.emit(Event.SET_LANGUAGE, {
            language: getBrowserLanguage(),
          });

          for (const event of Object.keys(eventFunctionMap)) {
            eventFunctionRemoveMap[event] = [];
            for (const eventCallback of eventFunctionMap[event])
              eventFunctionRemoveMap[event].push(
                $socket.on(event, eventCallback),
              );
          }

          if (config.auth.enabled) {
            const iframeElement = document.createElement("iframe");
            iframeElement.src = `${config.auth.api}/ping?connectionId=${token.split(".")[1]}`;
            iframeElement.width = String(0);
            iframeElement.height = String(0);
            iframeElement.style.border = "1px solid black";

            document.body.append(iframeElement);
          }
          resolve();
        });
        $socket.on("disconnected", () => {
          console.error("proxy disconnected!");
          isConnected = false;
          reject();
          clearConnection();
          System.loader.addText("Server is not reachable!");
        });
        await $socket.connect();
      } catch (e) {
        console.error(e);
        System.loader.addText("Something went extremely wrong :(");
      }
    });

  const loaded = () => {
    $socket.emit("$$load", { p: performance.now(), meta });
  };

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
    preConnect,
    connect,
    getRefreshSession,
    loaded,

    emit,
    on,
  };
};
