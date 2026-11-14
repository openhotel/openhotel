import React, { useEffect } from "react";
import { useAccount, useUser } from "shared/hooks";
import { useNavigate } from "react-router-dom";

export const LogoutComponent: React.FC = () => {
  const navigate = useNavigate();

  const { logout } = useAccount();
  const { clear } = useUser();

  useEffect(() => {
    clear();
    logout()
      .then(() => navigate("/login"))
      .catch(() => navigate("/"));
  }, [logout, clear]);

  return <div />;
};
