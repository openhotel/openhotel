import React, { useEffect, useState } from "react";
import { useApi } from "shared/hooks";
import { useSearchParams } from "react-router-dom";
import { RedirectComponent } from "shared/components";

export const VerifyComponent: React.FC = () => {
  const { verify } = useApi();
  const [searchParams] = useSearchParams();

  const [isVerified, setIsVerified] = useState(null);

  const id = searchParams.get("id");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!id || !token) return;

    verify(id, token)
      .then(() => {
        setIsVerified(true);
      })
      .catch(() => setIsVerified(false));
  }, [id, token]);

  if (!id || !token) return <RedirectComponent to="/" />;
  if (isVerified === null) return <div>Verifying...</div>;
  return <div>{isVerified ? "Account verified!" : "Invalid id or token!"}</div>;
};
