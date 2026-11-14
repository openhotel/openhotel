import { createContext, useContext } from "react";
import type React from "react";

type _TemplateState = {};

const _TemplateContext = createContext<_TemplateState>(undefined);

type _TemplateProps = {
  children: React.ReactNode;
};

export const _TemplateProvider: React.FunctionComponent<_TemplateProps> = ({
  children,
}) => {
  return <_TemplateContext.Provider value={{}} children={children} />;
};

export const useTemplate = (): _TemplateState => useContext(_TemplateContext);
