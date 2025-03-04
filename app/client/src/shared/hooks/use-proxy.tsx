import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { LoaderComponent } from "shared/components";
import { useConfig } from ".";
import {
  getClientSocket,
  getRandomString,
  getWebSocketUrl,
} from "shared/utils";
import { ulid } from "ulidx";

type ProxyState = {};

const ProxyContext = React.createContext<ProxyState>(undefined);

type ProxyProps = {
  children: ReactNode;
};

export const ProxyProvider: React.FunctionComponent<ProxyProps> = ({
  children,
}) => {
  const { config } = useConfig();

  const socketRef = useRef<any>(null);

  const [loadingMessage, setLoadingMessage] = useState<string>("Connecting...");

  useEffect(() => {
    //pre connection
    setLoadingMessage("Requesting connection...");
    const params = new URLSearchParams(location.search);
    let state = params.get("state");
    let token = params.get("token");
    let meta = params.get("meta");

    const canConnect = (state && token) || !config.auth.enabled;

    if (!canConnect) {
      console.log("><<");
      return;
    }
    //connection
    setLoadingMessage("Connecting...");
    window.history.pushState(null, null, "/");

    socketRef.current = getClientSocket({
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
    socketRef.current.on("connected", () => {
      setLoadingMessage(null);
    });
    socketRef.current.on("disconnected", () => {
      setLoadingMessage("Proxy disconnected!");
    });
    socketRef.current.connect().catch(() => {
      setLoadingMessage("Proxy is not reachable! :(");
    });

    return () => {
      socketRef.current.close();
    };
  }, [setLoadingMessage, config]);

  return (
    <ProxyContext.Provider
      value={{}}
      children={
        <LoaderComponent message={loadingMessage} children={children} />
      }
    />
  );
};

export const useProxy = (): ProxyState => useContext(ProxyContext);
