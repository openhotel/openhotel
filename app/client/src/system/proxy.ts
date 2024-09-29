import {
  getBrowserLanguage,
  getClientSocket,
  getRandomString,
  getVersion,
  getWebSocketUrl,
  isAuthDisabled,
  isDevelopment,
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
    if (isAuthDisabled() || canConnect()) return;

    //prevent auth disconnection
    setInterval(() => {
      fetch(getPingUrl(), {
        method: "POST",
        headers,
        body: JSON.stringify({
          ticketId,
          accountId,
          server: location.origin,
        }),
      });
    }, 30_000);

    const { status, data } = await fetch(
      `/request?version=${getVersion()}`,
    ).then((data) => data.json());
    if (status === 200) {
      localStorage.setItem("protocolToken", data.protocolToken);
      window.location.href = data.redirectUrl;
      return;
    }
    System.loader.addText("Something went wrong  :(");
  };

  const connect = async () =>
    new Promise<void>(async (resolve, reject) => {
      try {
        if (isConnected) return;
        System.loader.addText("Connecting...");
        $socket = getClientSocket({
          url: getWebSocketUrl(`${window.location.origin}/proxy`),
          protocols: isAuthDisabled()
            ? [
                "DEVELOPMENT",
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
          if (isDevelopment()) connect();
        });
        await $socket.connect();
      } catch (e) {
        System.loader.addText("Something went wrong :(");
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
    preConnect,
    connect,
    getRefreshSession,

    emit,
    on,
  };
};
