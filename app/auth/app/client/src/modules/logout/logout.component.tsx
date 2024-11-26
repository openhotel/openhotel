import React, { useEffect } from "react";
import { useAccount } from "shared/hooks";
import { useNavigate } from "react-router-dom";

export const LogoutComponent: React.FC = () => {
  const navigate = useNavigate();

  const { logout } = useAccount();

  useEffect(() => {
    logout()
      .then(() => navigate("/login"))
      .catch(() => navigate("/"));
  }, [logout]);

  return <div />;
};
