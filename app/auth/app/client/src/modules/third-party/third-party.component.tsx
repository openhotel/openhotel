import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RedirectComponent } from "shared/components";
import { useAccount, useUser } from "shared/hooks";

export const ThirdPartyComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isLogged } = useAccount();
  const { addThirdParty } = useUser();

  const appId = searchParams.get("appId");

  useEffect(() => {
    if (!isLogged) return;
    try {
      addThirdParty(appId).then((url) => {
        console.log(url);
        if (!url) return navigate("/");
        window.location.href = url;
      });
    } catch (e) {
      navigate("/");
    }
  }, [isLogged, addThirdParty]);

  if (isLogged !== null && !isLogged) return <RedirectComponent to="/login" />;

  return <div>Thinking...</div>;
};
