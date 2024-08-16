import React, { useEffect, useState } from "react";
import { RedirectComponent } from "shared/components";
import { useApi } from "shared/hooks";

export const LogoutComponent: React.FC = () => {
  const [isLogout, setIsLogout] = useState<boolean>(false);

  const { logout } = useApi();

  useEffect(() => {
    logout().then(() => {
      setIsLogout(true);
    });
  }, [logout]);

  return isLogout ? <RedirectComponent to="/" /> : <div />;
};
