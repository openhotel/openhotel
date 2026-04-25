import React, { useEffect, useState } from "react";
import { useApi, useConfig } from "shared/hooks";

type Props = {
  children: React.ReactNode;
};

export const PhantomProvider: React.FC<Props> = ({ children }) => {
  const { getPath } = useApi();
  const { isDevelopment } = useConfig();

  const [isLogged, setIsLogged] = useState<boolean>(isDevelopment());

  useEffect(() => {
    if (isLogged) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) return;

    params.delete("token");

    const search = params.toString();
    const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;

    window.history.replaceState({}, document.title, url);

    fetch(getPath("/token"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setIsLogged(res.status === 200);
      })
      .catch(() => {
        setIsLogged(false);
      });
  }, [isLogged]);

  return isLogged ? children : null;
};
