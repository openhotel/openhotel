import React, { ReactNode, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

type TitleState = {
  setTitle: (title: string) => void;
};

const TitleContext = React.createContext<TitleState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const TitleProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const setTitle = (title: string) => {
    document.title = title?.length ? `${title} — Open Hotel` : "Open Hotel";
  };

  const location = useLocation();
  useEffect(() => {
    const page = location.pathname.split("/").toReversed()[0].replace("-", " ");
    setTitle(
      page?.length ? page.slice(0, 1).toUpperCase() + page.slice(1) : null,
    );
  }, [setTitle, location]);

  return (
    <TitleContext.Provider
      value={{
        setTitle,
      }}
      children={children}
    />
  );
};

export const useTitle = (): TitleState => useContext(TitleContext);
