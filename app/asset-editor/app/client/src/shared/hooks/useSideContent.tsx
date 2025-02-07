import React, { ReactNode, useContext, useState } from "react";

type SideContentState = {
  component: ReactNode;
  setComponent: (component: ReactNode) => void;
};

const SideContentContext = React.createContext<SideContentState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const SideContentProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const [component, setComponent] = useState<ReactNode>(null);

  return (
    <SideContentContext.Provider
      value={{
        component,
        setComponent,
      }}
      children={children}
    />
  );
};

export const useSideContent = (): SideContentState =>
  useContext(SideContentContext);
