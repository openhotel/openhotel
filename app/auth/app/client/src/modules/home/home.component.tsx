import React, { useEffect, useState } from "react";
import { RedirectComponent } from "shared/components";
import { useApi } from "shared/hooks";

export const HomeComponent: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const { refreshSession } = useApi();

  useEffect(() => {
    if (window.location.pathname === "/logout") return;

    refreshSession()
      .then(({ redirectUrl }) => {
        window.location.href = redirectUrl;
      })
      .catch(() => {
        console.log("Cannot refresh session!");
        setIsReady(true);
      });
  }, [refreshSession]);

  return !isReady ? <div /> : <RedirectComponent to="/login" />;
};
