import React, { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useConnection } from "shared/hooks";

export const PingComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { ping } = useConnection();

  const connectionId = searchParams.get("connectionId");

  const $ping = useCallback(() => {
    ping(connectionId).then(({ estimatedNextPingIn }) => {
      setTimeout($ping, estimatedNextPingIn);
    });
  }, [ping]);

  useEffect(() => {
    if (!connectionId) return;
    $ping();
  }, [connectionId]);

  return <div />;
};
