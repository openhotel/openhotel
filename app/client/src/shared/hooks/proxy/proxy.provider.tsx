import React, { ReactNode, useCallback, useState } from "react";
import { ProxyContext } from "./proxy.context";
import { useConfig } from "shared/hooks";
import {
  getBrowserLanguage,
  getClientSocket,
  getRandomString,
  getWebSocketUrl,
} from "shared/utils";
import { ulid } from "ulidx";
import { Event } from "shared/enums";
import { LoaderComponent } from "shared/components";

type ProxyProps = {
  children: ReactNode;
};

export const ProxyProvider: React.FunctionComponent<ProxyProps> = ({
  children,
}) => {
  const { getConfig } = useConfig();

  const [loadingMessage, setLoadingMessage] = useState<string>("Connecting...");

  const params = new URLSearchParams(location.search);
  const state = params.get("state");
  const token = params.get("token");
  const meta = params.get("meta");

  const load = useCallback(() => {
    socket.emit("$$load", { p: performance.now(), meta });
  }, []);

  const [socket] = useState(() => {
    const config = getConfig();
    //pre connection
    setLoadingMessage("Requesting connection...");
    const canConnect = (state && token) || !config.auth.enabled;

    if (!canConnect) {
      fetch(`/request?version=${config.version}`)
        .then((data) => data.json())
        .then(({ status, data }) => {
          if (status !== 200)
            return setLoadingMessage("Something went wrong :(");

          const redirectUrl = new URL(data.redirectUrl);
          if (meta) redirectUrl.searchParams.append("meta", meta);
          window.location.replace(redirectUrl);
        });

      setLoadingMessage("Redirecting...");
      return;
    }
    //connection
    setLoadingMessage("Connecting...");
    if (window.location.pathname !== "/phantom")
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
      $ping();
    });
    $socket.on("disconnected", () => {
      setLoadingMessage("Proxy disconnected!");
    });
    $socket.connect().catch(() => {
      setLoadingMessage("Proxy is not reachable! :(");
    });

    return $socket;
  });

  const $ping = useCallback(() => {
    const config = getConfig();
    if (!config.auth.enabled) return;

    const pingUrl = new URL(config.auth.api);
    pingUrl.pathname = "/api/v3/user/@me/connection/ping";
    pingUrl.searchParams.append("connectionId", token.split(".")[1]);

    fetch(pingUrl, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then(({ status, data }) => {
        if (status !== 200) return emit(Event.DISCONNECTED, {});
        setTimeout($ping, data.estimatedNextPingIn);
      });
  }, [getConfig()]);

  const emit = useCallback(
    (event: Event, message: unknown) => {
      socket?.emit("$$user-data", { event, message });
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
