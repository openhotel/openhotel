import {
  getBrowserLanguage,
  getClientSocket,
  getRandomString,
  getWebSocketUrl,
} from "shared/utils";
import { Event } from "shared/enums";
import { System } from "system/system";
import { getPingUrl } from "shared/utils/auth.utils";

export const proxy = () => {
  let isConnected: boolean = false;

  let $socket;
  let eventFunctionMap: Record<Event | string, Function[]> = {};
  let eventFunctionRemoveMap: Record<Event | string, Function[]> = {};

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const params = new URLSearchParams(location.search);
  let ticketId = params.get("ticketId");
  let sessionId = params.get("sessionId");
  let token = params.get("token");
  let accountId = params.get("accountId");
  let protocolToken = localStorage.getItem("protocolToken");
  window.history.pushState(null, null, "/");

  const getRefreshSession = () => {
    try {
      return JSON.parse(atob(localStorage.getItem("session-refresh")));
    } catch (e) {
      return null;
    }
  };

  const canConnect = () => ticketId && sessionId && token && protocolToken;

  const clearConnection = () => {
    ticketId = null;
    sessionId = null;
    token = null;
    protocolToken = null;
  };

  const preConnect = async () => {
    System.loader.addText("Requesting connection...");
    if (
      System.version.isDevelopment() ||
      canConnect() ||
      !System.config.get().auth.enabled
    )
      return;

    const { status, data } = await fetch(
      `/request?version=${System.version.getVersion()}`,
    ).then((data) => data.json());
    if (status === 200) {
      localStorage.setItem("protocolToken", data.protocolToken);
      window.location.href = data.redirectUrl;
      return;
    }
    System.loader.addText("Something went wrong  :(");
  };

  const $pingAuth = () =>
    fetch(getPingUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify({
        ticketId,
        accountId,
        server: location.origin,
      }),
    });

  const connect = async () =>
    new Promise<void>(async (resolve, reject) => {
      try {
        const config = System.config.get();
        if (isConnected) return;
        System.loader.addText("Connecting...");
        const $isAuthDisabled =
          System.version.isDevelopment() || !config.auth.enabled;

        //prevent auth disconnection
        if (!$isAuthDisabled && config.auth.pingCheck) {
          setInterval($pingAuth, 30_000);
          $pingAuth();
        }

        $socket = getClientSocket({
          url: getWebSocketUrl(`${window.location.origin}/proxy`),
          protocols: $isAuthDisabled
            ? [
                "development",
                localStorage.getItem("username") ||
                  `player_${getRandomString(4)}`,
              ]
            : [protocolToken, ticketId, sessionId, token],
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

          resolve();
        });
        $socket.on("disconnected", () => {
          console.error("proxy disconnected!");
          isConnected = false;
          reject();
          clearConnection();
          if (System.version.isDevelopment()) connect();
        });
        await $socket.connect();
      } catch (e) {
        System.loader.addText("Something went wrong :(");
      }
    });

  const loaded = () => {
    $socket.emit("$$load", { p: performance.now() });
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
