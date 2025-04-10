import { useContext } from "react";
import { TemplateContext, TemplateState } from "./template.context";

export const useTemplate = (): TemplateState => useContext(TemplateContext);
