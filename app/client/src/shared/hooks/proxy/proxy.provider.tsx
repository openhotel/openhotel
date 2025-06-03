import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { ProxyContext } from "./proxy.context";
import { useConfig } from "shared/hooks";
import {
  getClientSocket,
  getRandomString,
  getWebSocketUrl,
} from "shared/utils";
import { ulid } from "ulidx";
import { Event, SpriteSheetEnum } from "shared/enums";
import {
  CountdownComponent,
  LoaderComponent,
  TextComponent,
} from "shared/components";
import { useTranslation } from "react-i18next";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@openhotel/pixi-components";
import { SOCKET_RECONNECT_SECONDS } from "shared/consts/socket.consts";

type ProxyProps = {
  children: ReactNode;
};

export const ProxyProvider: React.FunctionComponent<ProxyProps> = ({
  children,
}) => {
  const { t } = useTranslation();
  const { getConfig, isDevelopment } = useConfig();

  const [loadingMessage, setLoadingMessage] = useState<string>(
    t("system.connecting"),
  );
  const [reloadProxy, setReloadProxy] = useState<boolean>(false);

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
            return setLoadingMessage(t("system.something_went_wrong"));

          const redirectUrl = new URL(data.redirectUrl);
          if (meta) redirectUrl.searchParams.append("meta", meta);
          window.location.replace(redirectUrl);
        });

      setLoadingMessage(t("system.redirecting"));
      return;
    }
    //connection
    setLoadingMessage(t("system.connecting"));
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
      silent: !isDevelopment(),
    });
    $socket.on("connected", () => {
      setLoadingMessage(null);
      $ping();
    });
    $socket.on("disconnected", () => {
      setLoadingMessage(t("system.proxy_disconnected"));
      setReloadProxy(true);
    });
    $socket.connect().catch(() => {
      setLoadingMessage(t("proxy_not_reachable"));
      setReloadProxy(true);
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
  }, [getConfig]);

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

  const onReload = useCallback(() => {
    window.location.reload();
  }, []);

  const renderReloadProxy = useMemo(
    () =>
      loadingMessage && reloadProxy ? (
        <ContainerComponent>
          <FlexContainerComponent
            justify={FLEX_JUSTIFY.CENTER}
            align={FLEX_ALIGN.CENTER}
          >
            <FlexContainerComponent
              pivot={{
                y: -14,
              }}
              gap={5}
            >
              <TextComponent text={t("system.reconnecting_in")} />
              <CountdownComponent
                count={isDevelopment() ? 3 : SOCKET_RECONNECT_SECONDS}
                spriteSheet={SpriteSheetEnum.DEFAULT_FONT}
                onDone={onReload}
              />
              <TextComponent text={t("system.seconds")} />
            </FlexContainerComponent>
          </FlexContainerComponent>
        </ContainerComponent>
      ) : null,
    [isDevelopment, loadingMessage, reloadProxy],
  );

  return (
    <ProxyContext.Provider
      value={{
        emit,
        on,
        load,
      }}
      children={
        <>
          <LoaderComponent message={loadingMessage} children={children} />
          {renderReloadProxy}
        </>
      }
    />
  );
};
