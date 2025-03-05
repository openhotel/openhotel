import React, { ReactNode, useCallback, useContext, useState } from "react";
import { LoaderComponent } from "shared/components";
import { useConfig } from ".";
import {
  getBrowserLanguage,
  getClientSocket,
  getRandomString,
  getWebSocketUrl,
} from "shared/utils";
import { ulid } from "ulidx";
import { Event } from "shared/enums";

type ProxyState = {
  emit: <Data>(event: Event, data: Data) => void;
  on: (
    event: Event,
    callback: (data: unknown) => void | Promise<void>,
  ) => () => void;
  load: () => void;
};

const ProxyContext = React.createContext<ProxyState>(undefined);

type ProxyProps = {
  children: ReactNode;
};

export const ProxyProvider: React.FunctionComponent<ProxyProps> = ({
  children,
}) => {
  const { config } = useConfig();

  const [loadingMessage, setLoadingMessage] = useState<string>("Connecting...");

  const params = new URLSearchParams(location.search);
  const state = params.get("state");
  const token = params.get("token");
  const meta = params.get("meta");

  const load = useCallback(() => {
    socket.emit("$$load", { p: performance.now(), meta });
  }, []);

  const [socket] = useState(() => {
    //pre connection
    setLoadingMessage("Requesting connection...");
    const canConnect = (state && token) || !config.auth.enabled;

    if (!canConnect) {
      setLoadingMessage("Redirecting...");
      return;
    }
    //connection
    setLoadingMessage("Connecting...");
    window.history.pushState(null, null, "/");

    const $socket = getClientSocket({
      url: getWebSocketUrl(`${window.location.origin}/proxy`),
      protocols: config.auth.enabled
        ? [state, token]
        : [
            localStorage.getItem("accountId") || ulid(),
            localStorage.getItem("username") || `player_${getRandomString(4)}`,
          ],
      reconnect: false,
      silent: true,
    });
    $socket.on("connected", () => {
      setLoadingMessage(null);

      $socket.emit<Event>(Event.SET_LANGUAGE, {
        language: getBrowserLanguage(),
      });
    });
    $socket.on("disconnected", () => {
      setLoadingMessage("Proxy disconnected!");
    });
    $socket.connect().catch(() => {
      setLoadingMessage("Proxy is not reachable! :(");
    });

    return $socket;
  });

  const emit = useCallback(
    (event: Event, data: unknown) => {
      socket?.emit("$$user-data", { event, message: data });
    },
    [socket],
  );

  const on = useCallback(
    (event: Event, callback: (data: unknown) => void | Promise<void>) =>
      socket?.on(event, callback),
    [socket],
  );

  return (
    <ProxyContext.Provider
      value={{
        emit,
        on,
        load,
      }}
      children={
        <LoaderComponent message={loadingMessage} children={children} />
      }
    />
  );
};

export const useProxy = (): ProxyState => useContext(ProxyContext);
