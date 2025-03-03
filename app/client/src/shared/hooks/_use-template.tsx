import React, { ReactNode, useContext } from "react";

type _TemplateState = {};

const _TemplateContext = React.createContext<_TemplateState>(undefined);

type _TemplateProps = {
  children: ReactNode;
};

export const _TemplateProvider: React.FunctionComponent<_TemplateProps> = ({
  children,
}) => {
  return <_TemplateContext.Provider value={{}} children={children} />;
};

export const useTemplate = (): _TemplateState => useContext(_TemplateContext);
