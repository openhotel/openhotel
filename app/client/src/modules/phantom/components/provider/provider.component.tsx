import React, { useEffect, useState } from "react";
import { useApiPath } from "shared/hooks";

type Props = {
  children: React.ReactNode;
};

export const PhantomProvider: React.FC<Props> = ({ children }) => {
  const { getPath } = useApiPath();

  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    fetch(getPath(`/token?token=${params.get("token")}`)).then((res) => {
      setIsLogged(res.status === 200);
    });
  }, [isLogged]);

  return isLogged ? children : null;
};
