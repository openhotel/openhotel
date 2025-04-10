import React, { ReactNode } from "react";
import { TemplateContext } from "./template.context";

type TemplateProps = {
  children: ReactNode;
};

export const TemplateProvider: React.FunctionComponent<TemplateProps> = ({
  children,
}) => {
  return <TemplateContext.Provider value={{}} children={children} />;
};
