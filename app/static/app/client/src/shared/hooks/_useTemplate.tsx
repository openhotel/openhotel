import React, { ReactNode, useContext } from "react";

type _TemplateState = {};

const _TemplateContext = React.createContext<_TemplateState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const _TemplateProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  return <_TemplateContext.Provider value={{}} children={children} />;
};

export const useTemplate = (): _TemplateState => useContext(_TemplateContext);
