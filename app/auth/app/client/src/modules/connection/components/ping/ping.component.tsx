import React, { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const PingComponent: React.FC = () => {
  const [searchParams] = useSearchParams();

  const fingerprint = searchParams.get("fingerprint");
  const connectionId = searchParams.get("connectionId");

  const $ping = useCallback(() => {
    fetch(`api/v3/user/@me/connection/ping?connectionId=${connectionId}`, {
      method: "PATCH",
      headers: new Headers({
        fingerprint,
      }),
    })
      .then((response) => response.json())
      .then(({ data: { estimatedNextPingIn } }) => {
        setTimeout($ping, estimatedNextPingIn);
      });
  }, []);

  useEffect(() => {
    if (!connectionId) return;
    $ping();
  }, [connectionId]);

  return <div />;
};
