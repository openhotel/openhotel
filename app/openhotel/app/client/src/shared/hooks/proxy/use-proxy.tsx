import { useContext } from "react";
import { ProxyContext, ProxyState } from "shared/hooks/proxy/proxy.context";

export const useProxy = (): ProxyState => useContext(ProxyContext);
