import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RedirectComponent } from "shared/components";
import { useAccount, useUser } from "shared/hooks";
import { getLoginRedirect } from "shared/utils";

export const AppsComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLogged } = useAccount();

  const { addApp } = useUser();
  //
  const appId = searchParams.get("appId");

  useEffect(() => {
    if (!isLogged) return;

    addApp(appId)
      .then((url) => {
        if (!url) return navigate("/");
        window.location.href = url;
      })
      .catch(() => {
        navigate("/");
      });
  }, [isLogged, addApp]);

  if (!appId) return <RedirectComponent to="/" />;
  if (isLogged !== null && !isLogged)
    return <RedirectComponent to={getLoginRedirect({ type: "app", appId })} />;

  return <div>Thinking...</div>;
};
