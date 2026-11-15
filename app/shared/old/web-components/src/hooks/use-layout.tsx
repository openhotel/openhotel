import { createContext, useCallback, useContext, useState } from "react";
import type React from "react";

type LayoutState = {
  openNavigator: boolean;
  toggleNavigator: () => void;
};

const LayoutContext = createContext<LayoutState>(undefined);

type LayoutProps = {
  children: React.ReactNode;
};

export const LayoutProvider: React.FunctionComponent<LayoutProps> = ({
  children,
}) => {
  const [openNavigator, setOpenNavigator] = useState<boolean>(false);

  const toggleNavigator = useCallback(() => {
    setOpenNavigator((open) => !open);
  }, [setOpenNavigator]);

  return (
    <LayoutContext.Provider
      value={{
        openNavigator,
        toggleNavigator,
      }}
      children={children}
    />
  );
};

export const useLayout = (): LayoutState => useContext(LayoutContext);
